import { DEFAULT_MECH_FEE } from 'common-util/constants';
import {
  MARKETPLACE_GRAPH_CLIENTS,
  polymarketAgentsGraphClient,
  predictAgentsGraphClient,
} from 'common-util/graphql/client';
import {
  getMarketplaceSendersQuery,
  getMechRequestsIncrementalQuery,
  getOmenDailyProfitStatsQuery,
  getOmenTraderAgentsQuery,
  getPolymarketDailyProfitStatsQuery,
  getPolymarketTraderAgentsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const LIMIT = 1000;
// Process at most this many days per cron run to stay within timeout
const MAX_DAYS_PER_RUN = 30;
const DAY_SECONDS = 86400;
// Keep only this many days in byDay (covers the longest non-global tab: 90D)
const BYDAY_RETENTION_DAYS = 90;
// FIX-2: age-out TTL for pending QMR entries (markets resolve in ~4 days)
const QMR_MAX_AGE_DAYS = 14;
// Minimum lifetime bets before an agent's ROI is included in the histogram.
// Mirrors trader's MIN_TRADES_FOR_ROI_DISPLAY — low-activity agents (1-2 bets)
// produce statistically meaningless ROIs that distort the tails.
const MIN_TRADES_FOR_ROI_DISPLAY = 10;

// Genesis timestamps (UTC midnight) for each agent type
const OMEN_GENESIS_TS = 1763769600;
const POLYMARKET_GENESIS_TS = 1768867200;
// Earliest block timestamp to consider when fetching mech requests
const GNOSIS_MECH_REQUESTS_GENESIS_TS = 1763078400;
const POLYGON_MECH_REQUESTS_GENESIS_TS = 1763078400;

const dayKeyOf = (ts: number): string => String(Math.floor(ts / DAY_SECONDS) * DAY_SECONDS);

// ─── Blob related query types ────────────────────────────────────────────────────

/**
 * QMR (Question Mech Requests) — stored in a separate blob from the main AgentBlueprintRoiData.
 * Only read/written by cron handlers, never read at page load.
 * Only contains requests for currently-OPEN markets (~4-day window at steady state).
 * When a market appears in profitParticipants of agent daily statistic, it means this market participated in profit
 * calculation - it was either settled and the trade was incorrect, or payed out, if the trade was correct.
 * For such markets its entry is deleted from QMR and the count is materialized
 * into byDay[date].agents[agentId].participants.
 */
/**
 * FIX-1: Store per-request blockTimestamps (ascending) instead of a flat count.
 * On settlement, each request is attributed to the day it was actually made,
 * instead of being collapsed onto the settlement day.
 */
export type QmrData = {
  questionMechRequests: Record<string, Record<string, number[]>>; // title → agentId → sorted asc timestamps
  lastMechRequestTimestamp: number;
};

/** Per-agent daily aggregates, used for 'd7' | 'd30' | 'd90' distributions */
export type DailyAgentEntry = {
  profit: string;
  payout: string;
  /**
   * Total mech request count resolved at the time markets settled or payed out.
   * Deduplicated: an agent placing multiple bets on the same market counts that
   * market's requests entry once, not once per bet.
   */
  mechRequests: number;
};

/** Per-agent all-time aggregates — used for 'max' distribution. */
export type AllTimeAgentEntry = {
  payout: string;
  tradingCosts: string;
  mechRequests: number; // senders.total - sum of remaining QMR entries (open markets only)
  totalBets: number; // lifetime bet count — used for activity threshold filter
};

/** Main blob type - contains daily and all-time agent statistics */
export type AgentBlueprintRoiData = {
  byDay: Record<
    string, // UTC midnight timestamp string
    { agents: Record<string, DailyAgentEntry> }
  >;
  lastDayTimestamp: number;
  allTimeAgents: Record<string, AllTimeAgentEntry>; // agentId → all-time totals
};

// ─── Internal query types ────────────────────────────────────────────────────

type DailyStatEntry = {
  traderAgent: { id: string };
  date: string;
  totalBets: number;
  totalPayout: string;
  dailyProfit: string;
  profitParticipants: Array<{ question?: string; metadata?: { title: string } }>;
};

type MechRequestEntry = {
  sender: { id: string } | null;
  blockTimestamp: string;
  parsedRequest: { questionTitle: string } | null;
};

type OmenTraderAgentEntry = {
  id: string;
  totalTradedSettled: string;
  totalFeesSettled: string;
  totalPayout: string;
  totalBets: string;
};

type PolyTraderAgentEntry = {
  id: string;
  totalTradedSettled: string;
  totalPayout: string;
  totalBets: string;
};

type SenderEntry = {
  id: string;
  totalLegacyRequests: string;
  totalMarketplaceRequests: string;
};

// ─── Daily stat fetchers ─────────────────────────────────────────────────────

const fetchOmenstratDailyStats = async (
  dayStartTs: number,
  dayEndTs: number
): Promise<DailyStatEntry[]> => {
  const results: DailyStatEntry[] = [];
  let skip = 0;
  while (true) {
    try {
      const response = (await predictAgentsGraphClient.request(
        getOmenDailyProfitStatsQuery({
          date_gte: dayStartTs,
          date_lte: dayEndTs,
          first: LIMIT,
          skip,
        })
      )) as { dailyProfitStatistics: DailyStatEntry[] };
      const page = response?.dailyProfitStatistics ?? [];
      results.push(...page);
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error('Error fetching Omenstrat daily stats', e);
      break;
    }
  }
  return results;
};

const fetchPolystratDailyStats = async (
  dayStartTs: number,
  dayEndTs: number
): Promise<DailyStatEntry[]> => {
  const results: DailyStatEntry[] = [];
  let skip = 0;
  while (true) {
    try {
      const response = (await polymarketAgentsGraphClient.request(
        getPolymarketDailyProfitStatsQuery({
          date_gte: dayStartTs,
          date_lte: dayEndTs,
          first: LIMIT,
          skip,
        })
      )) as { dailyProfitStatistics: DailyStatEntry[] };
      const page = response?.dailyProfitStatistics ?? [];
      results.push(...page);
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error('Error fetching Polystrat daily stats', e);
      break;
    }
  }
  return results;
};

// ─── Incremental mech request fetcher ────────────────────────────────────────

/**
 * Fetches Mech requests from the Marketplace subgraph that occurred after lastTimestamp (recorder in blob).
 * Returns a nested mapping: { [marketTitle]: { [agentId]: totalRequests } }.
 */
const fetchIncrementalMechRequests = async (
  chain: 'gnosis' | 'polygon',
  lastTimestamp: number
): Promise<{ additions: Record<string, Record<string, number[]>>; lastTimestamp: number }> => {
  // FIX-1: additions now stores timestamps per (title, agentId), not just counts.
  const additions: Record<string, Record<string, number[]>> = {};
  let latestTs = lastTimestamp;
  let skip = 0;
  const client = MARKETPLACE_GRAPH_CLIENTS[chain];

  while (true) {
    try {
      const response = (await client.request(
        getMechRequestsIncrementalQuery({ timestamp_gt: lastTimestamp, first: LIMIT, skip })
      )) as { requests: MechRequestEntry[] };
      const page = response?.requests ?? [];
      for (const req of page) {
        const agentId = req.sender?.id?.toLowerCase();
        const questionTitle = req.parsedRequest?.questionTitle;
        const ts = Number(req.blockTimestamp ?? 0);
        if (!agentId || !questionTitle || ts <= 0) continue;
        if (!additions[questionTitle]) additions[questionTitle] = {};
        if (!additions[questionTitle][agentId]) additions[questionTitle][agentId] = [];
        additions[questionTitle][agentId].push(ts);
        if (ts > latestTs) latestTs = ts;
      }
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error(`Error fetching incremental mech requests for ${chain}`, e);
      break;
    }
  }
  return { additions, lastTimestamp: latestTs };
};

// ─── All-time agent data fetcher ─────────────────────────────────────────────

/**
 * Fetches all-time trader agent totals and marketplace sender totals.
 * Uses remaining QMR (open markets only) to subtract open-market requests from senderTotal.
 */
const fetchAllTimeAgents = async (
  agentBlueprint: 'omenstrat' | 'polystrat',
  openQmr: Record<string, Record<string, number[]>>
): Promise<Record<string, AllTimeAgentEntry>> => {
  const chain: 'gnosis' | 'polygon' = agentBlueprint === 'omenstrat' ? 'gnosis' : 'polygon';
  const SCALE = agentBlueprint === 'polystrat' ? BigInt('1000000000000') : 1n;

  // 1. Paginate traderAgents from predict subgraph (Settled Volume)
  const agentMap = new Map<string, { payout: bigint; tradingCosts: bigint; totalBets: number }>();
  let skip = 0;
  while (true) {
    try {
      let page: Array<OmenTraderAgentEntry | PolyTraderAgentEntry> = [];
      if (agentBlueprint === 'omenstrat') {
        const response = (await predictAgentsGraphClient.request(
          getOmenTraderAgentsQuery({ first: LIMIT, skip })
        )) as { traderAgents: OmenTraderAgentEntry[] };
        page = response?.traderAgents ?? [];
        for (const agent of page as OmenTraderAgentEntry[]) {
          const agentId = agent.id.toLowerCase();
          // Omenstrat costs = (Traded + Fees) * 10^0
          const tradingCosts =
            (BigInt(agent.totalTradedSettled) + BigInt(agent.totalFeesSettled)) * SCALE;
          agentMap.set(agentId, {
            payout: BigInt(agent.totalPayout) * SCALE,
            tradingCosts,
            totalBets: Number(agent.totalBets ?? 0),
          });
        }
      } else {
        const response = (await polymarketAgentsGraphClient.request(
          getPolymarketTraderAgentsQuery({ first: LIMIT, skip })
        )) as { traderAgents: PolyTraderAgentEntry[] };
        page = response?.traderAgents ?? [];
        for (const agent of page as PolyTraderAgentEntry[]) {
          const agentId = agent.id.toLowerCase();
          // Polystrat costs = Traded * 10^12 (to bring USDC 6 dec up to 18 dec)
          agentMap.set(agentId, {
            payout: BigInt(agent.totalPayout) * SCALE,
            tradingCosts: BigInt(agent.totalTradedSettled) * SCALE,
            totalBets: Number(agent.totalBets ?? 0),
          });
        }
      }
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error(`Error fetching traderAgents for ${agentBlueprint}`, e);
      break;
    }
  }

  // 2. Paginate senders from marketplace subgraph (Global Mech Cost)
  const senderMap = new Map<string, number>();
  skip = 0;
  while (true) {
    try {
      const response = (await MARKETPLACE_GRAPH_CLIENTS[chain].request(
        getMarketplaceSendersQuery({ first: LIMIT, skip })
      )) as { senders: SenderEntry[] };
      const page = response?.senders ?? [];
      for (const sender of page) {
        const agentId = sender.id.toLowerCase();
        senderMap.set(
          agentId,
          Number(sender.totalLegacyRequests) + Number(sender.totalMarketplaceRequests)
        );
      }
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error(`Error fetching senders for ${agentBlueprint}`, e);
      break;
    }
  }

  // 3. Aggregate "Pending" Mech requests from the current QMR state.
  // FIX-1: QMR values are now timestamp arrays; count = array length.
  const openRequests: Record<string, number> = {};
  for (const agentCounts of Object.values(openQmr)) {
    for (const [agentId, tsList] of Object.entries(agentCounts)) {
      openRequests[agentId] = (openRequests[agentId] ?? 0) + (tsList?.length ?? 0);
    }
  }

  // 4. Final Assembly
  // We only include agents that have at least some "Settled" trading costs.
  // This prevents "Unclaimed Wins" or "Inactive Signups" from appearing as -100% ROI.
  const allTimeAgents: Record<string, AllTimeAgentEntry> = {};

  for (const [agentId, { payout, tradingCosts, totalBets }] of agentMap.entries()) {
    // Skip agents with no settled activity
    if (tradingCosts <= 0n) continue;

    const senderTotal = senderMap.get(agentId) ?? 0;
    const openRequestCount = openRequests[agentId] ?? 0;

    // MechRequests = (Lifetime total from Marketplace) - (Current Pending in QMR)
    const settledMechRequests = Math.max(0, senderTotal - openRequestCount);

    allTimeAgents[agentId] = {
      payout: payout.toString(),
      tradingCosts: tradingCosts.toString(),
      mechRequests: settledMechRequests,
      totalBets,
    };
  }

  return allTimeAgents;
};

// ─── Agent data updater ───────────────────────────────────────────────────

/**
 * Normalizes titles to handle truncation, special characters, and casing.
 * Removes non-alphanumeric chars and takes a 100-char prefix.
 */
const normalizeTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 100);

/**
 * Legacy blobs stored QMR values as plain counts (`number`) instead of timestamp
 * arrays. Normalize on load so the rest of the pipeline only sees the new shape.
 * Legacy entries have no real per-request timestamps, so we stamp them with
 * `lastMechRequestTimestamp` — the most recent observed request before this
 * code was deployed, which bounds their real age from above and lets TTL
 * behave sensibly instead of flushing everything to epoch day 0.
 */
const normalizeQmrShape = (
  raw: Record<string, Record<string, number[] | number>> | undefined,
  fallbackTs: number
): Record<string, Record<string, number[]>> => {
  const out: Record<string, Record<string, number[]>> = {};
  if (!raw) return out;
  for (const [title, agentMap] of Object.entries(raw)) {
    const normalizedAgents: Record<string, number[]> = {};
    for (const [agentId, value] of Object.entries(agentMap ?? {})) {
      if (Array.isArray(value)) {
        normalizedAgents[agentId] = value;
      } else {
        const count = Number(value ?? 0);
        normalizedAgents[agentId] = count > 0 ? new Array(count).fill(fallbackTs) : [];
      }
    }
    out[title] = normalizedAgents;
  }
  return out;
};

const updateAgentBlueprintData = async (
  agentBlueprint: 'omenstrat' | 'polystrat',
  existing: AgentBlueprintRoiData | null,
  existingQmr: QmrData | null
): Promise<{ mainData: AgentBlueprintRoiData; qmrData: QmrData }> => {
  const genesisTs = agentBlueprint === 'omenstrat' ? OMEN_GENESIS_TS : POLYMARKET_GENESIS_TS;
  const chain: 'gnosis' | 'polygon' = agentBlueprint === 'omenstrat' ? 'gnosis' : 'polygon';
  const mechGenesisTs =
    agentBlueprint === 'omenstrat'
      ? GNOSIS_MECH_REQUESTS_GENESIS_TS
      : POLYGON_MECH_REQUESTS_GENESIS_TS;

  // 1: Update QMR (incremental mech requests)
  // FIX-1: QMR stores timestamp arrays per (title, agentId).
  const qmr = normalizeQmrShape(
    existingQmr?.questionMechRequests as
      | Record<string, Record<string, number[] | number>>
      | undefined,
    existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs
  );
  const { additions, lastTimestamp: newMechTs } = await fetchIncrementalMechRequests(
    chain,
    existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs
  );
  for (const [title, agentLists] of Object.entries(additions)) {
    if (!qmr[title]) qmr[title] = {};
    for (const [agentId, tsList] of Object.entries(agentLists)) {
      const existing = qmr[title][agentId] ?? [];
      // Merge ascending-sorted lists
      qmr[title][agentId] = [...existing, ...tsList].sort((a, b) => a - b);
    }
  }

  // Pre-calculate normalized mapping for Step 2 matching
  // normalizedKey -> originalKey
  const normalizedQmrMap = new Map<string, string>();
  Object.keys(qmr).forEach((originalTitle) => {
    normalizedQmrMap.set(normalizeTitle(originalTitle), originalTitle);
  });

  // 2: Update byDay (incremental daily stats)
  const startDay = existing?.lastDayTimestamp ? existing.lastDayTimestamp + DAY_SECONDS : genesisTs;
  const endDay = getMidnightUtcTimestampDaysAgo(1); // yesterday — only process fully complete days

  const byDay: Record<string, { agents: Record<string, DailyAgentEntry> }> = {
    ...(existing?.byDay ?? {}),
  };

  let lastDayTimestamp = existing?.lastDayTimestamp ?? endDay;

  if (startDay <= endDay) {
    const totalDays = Math.floor((endDay - startDay) / DAY_SECONDS) + 1;
    const daysToProcess = Math.min(totalDays, MAX_DAYS_PER_RUN);
    const processEndDay = startDay + (daysToProcess - 1) * DAY_SECONDS;

    const fetchStats =
      agentBlueprint === 'omenstrat' ? fetchOmenstratDailyStats : fetchPolystratDailyStats;
    const allStats = await fetchStats(startDay, processEndDay);

    const statsByDay = new Map<string, DailyStatEntry[]>();
    for (const stat of allStats) {
      const dayKey = String(stat.date);
      const list = statsByDay.get(dayKey) ?? [];
      list.push(stat);
      statsByDay.set(dayKey, list);
    }

    // Helper to create/ensure a byDay/agent entry (used only for TTL flush below)
    const ensureEntry = (dKey: string, aid: string): DailyAgentEntry => {
      if (!byDay[dKey]) byDay[dKey] = { agents: {} };
      if (!byDay[dKey].agents[aid]) {
        byDay[dKey].agents[aid] = { profit: '0', payout: '0', mechRequests: 0 };
      }
      return byDay[dKey].agents[aid];
    };

    for (let dayTs = startDay; dayTs <= processEndDay; dayTs += DAY_SECONDS) {
      const dayKey = String(dayTs);
      const dayStats = statsByDay.get(dayKey) ?? [];
      const agents: Record<string, DailyAgentEntry> = {};
      const qmrKeysUsedThisDay = new Set<string>();

      for (const stat of dayStats) {
        const agentId = stat.traderAgent.id.toLowerCase();

        // Unique titles from the predict subgraph
        const uniqueTitles = new Set<string>();
        for (const p of stat.profitParticipants ?? []) {
          const title = p.question ?? p.metadata?.title;
          if (title) uniqueTitles.add(title);
        }

        // Consume QMR entries onto the settlement day (product intent: all
        // market costs are grouped on the day the market settles, not on the
        // day the request was made).
        let mechRequests = 0;
        for (const title of uniqueTitles) {
          let matchedKey = qmr[title] ? title : null;
          if (!matchedKey) {
            matchedKey = normalizedQmrMap.get(normalizeTitle(title)) ?? null;
          }
          const tsList = matchedKey ? qmr[matchedKey]?.[agentId] : null;
          if (matchedKey && tsList && tsList.length > 0) {
            mechRequests += tsList.length;
            qmr[matchedKey][agentId] = [];
            qmrKeysUsedThisDay.add(matchedKey);
          }
        }

        agents[agentId] = {
          profit: stat.dailyProfit,
          payout: stat.totalPayout,
          mechRequests,
        };
      }

      if (Object.keys(agents).length > 0) {
        byDay[dayKey] = { agents };
      }

      // Cleanup QMR: Delete title if all agent lists are empty
      for (const key of qmrKeysUsedThisDay) {
        if (qmr[key]) {
          let total = 0;
          for (const agentList of Object.values(qmr[key])) total += agentList?.length ?? 0;
          if (total === 0) {
            delete qmr[key];
            normalizedQmrMap.delete(normalizeTitle(key));
          }
        }
      }
    }

    lastDayTimestamp = processEndDay;

    // FIX-2: Age-out pending QMR entries older than QMR_MAX_AGE_DAYS.
    // Markets resolve in ~4 days; anything older either never settled or has a
    // title-mismatch. Flush those timestamps onto their own days so they count
    // as settled mech requests (not permanently "open").
    const ttlCutoff = Math.floor(Date.now() / 1000) - QMR_MAX_AGE_DAYS * DAY_SECONDS;
    let expiredCount = 0;
    for (const [title, agentMap] of Object.entries(qmr)) {
      for (const [agentId, tsList] of Object.entries(agentMap)) {
        if (!tsList || tsList.length === 0) continue;
        const kept: number[] = [];
        for (const ts of tsList) {
          if (ts < ttlCutoff) {
            ensureEntry(dayKeyOf(ts), agentId).mechRequests++;
            expiredCount++;
          } else {
            kept.push(ts);
          }
        }
        if (kept.length === 0) delete agentMap[agentId];
        else agentMap[agentId] = kept;
      }
      if (Object.keys(agentMap).length === 0) {
        delete qmr[title];
        normalizedQmrMap.delete(normalizeTitle(title));
      }
    }
    if (expiredCount > 0) {
      console.log(
        `[roi-dist:${agentBlueprint}] expired ${expiredCount} QMR entries older than ${QMR_MAX_AGE_DAYS} days`
      );
    }
  }

  // 3: Prune byDay to BYDAY_RETENTION_DAYS
  const retentionCutoff = getMidnightUtcTimestampDaysAgo(0) - BYDAY_RETENTION_DAYS * DAY_SECONDS;
  for (const dayKey of Object.keys(byDay)) {
    if (Number(dayKey) < retentionCutoff) delete byDay[dayKey];
  }

  // 4: Recompute all-time agents (fresh each run)
  const allTimeAgents = await fetchAllTimeAgents(agentBlueprint, qmr);

  return {
    mainData: { byDay, lastDayTimestamp, allTimeAgents },
    qmrData: { questionMechRequests: qmr, lastMechRequestTimestamp: newMechTs },
  };
};

// ─── Public agent blueprint update exports ──────────────────────────────────────────

export const updateOmenstratData = (
  existing: AgentBlueprintRoiData | null,
  existingQmr: QmrData | null
): Promise<{ mainData: AgentBlueprintRoiData; qmrData: QmrData }> =>
  updateAgentBlueprintData('omenstrat', existing, existingQmr);

export const updatePolystratData = (
  existing: AgentBlueprintRoiData | null,
  existingQmr: QmrData | null
): Promise<{ mainData: AgentBlueprintRoiData; qmrData: QmrData }> =>
  updateAgentBlueprintData('polystrat', existing, existingQmr);

// ─── Histogram computation ───────────────────────────────────────────────────

const generateFineGrainedBins = (start: number, end: number, step: number) => {
  const bins = [];
  for (let i = start; i < end; i += step) {
    bins.push({
      label: `${i}% to ${i + step}%`,
      min: i,
      max: i + step,
    });
  }
  return bins;
};

export const ROI_BINS = [
  ...generateFineGrainedBins(-100, 200, 10), // Generates 40 bins: -100 to -90, ..., 190 to 200
  { label: '> 200%', min: 200, max: Number.POSITIVE_INFINITY },
];

export type BinData = {
  label: string;
  min: number;
  max: number;
  omenstrat: number; // % of agents
  polystrat: number;
};

const assignBin = (roi: number): number =>
  ROI_BINS.findIndex((bin) => roi >= bin.min && roi < bin.max);

const computeAgentBlueprintHistogram = (
  agentBlueprintData: AgentBlueprintRoiData,
  daysBack: number | null,
  isPolystrat: boolean
): number[] => {
  const binCounts = new Array<number>(ROI_BINS.length).fill(0);
  let activeAgents = 0;
  let excludedLowActivity = 0;

  if (daysBack === null) {
    // "All" range: already scaled in fetchAllTimeAgents
    for (const entry of Object.values(agentBlueprintData.allTimeAgents ?? {})) {
      const payout = BigInt(entry.payout);
      const tradingCosts = BigInt(entry.tradingCosts);

      // Skip zero trading costs considering it as "not enough data"
      if (tradingCosts <= 0n) continue;

      // Skip agents below the activity threshold — consistent with the
      // trader skill's "need more data" rule (MIN_TRADES_FOR_ROI_DISPLAY).
      if ((entry.totalBets ?? 0) < MIN_TRADES_FOR_ROI_DISPLAY) {
        excludedLowActivity++;
        continue;
      }

      // mechFees are already 18 decimals (USD/ETH/XDAI equivalent)
      const mechFees = BigInt(entry.mechRequests) * DEFAULT_MECH_FEE;
      const totalCosts = tradingCosts + mechFees;

      // ROI = (Payout - TotalCosts) / TotalCosts
      const roi = Number(((payout - totalCosts) * 10000n) / totalCosts) / 100;

      const binIdx = assignBin(roi);
      if (binIdx !== -1) {
        binCounts[binIdx]++;
        activeAgents++;
      }
    }
  } else {
    // 7D / 30D / 90D
    const scale = isPolystrat ? BigInt('1000000000000') : 1n; // Scale USDC (6) to WEI (18)
    const yesterdayTs = getMidnightUtcTimestampDaysAgo(1);
    const cutoffTs = yesterdayTs - (daysBack - 1) * DAY_SECONDS;

    type Totals = { profit: bigint; payout: bigint; mechRequests: number };
    const agentTotals = new Map<string, Totals>();

    for (const [dayKeyStr, dayData] of Object.entries(agentBlueprintData.byDay)) {
      const dayTs = Number(dayKeyStr);
      // Counts [daysBack] full days excluding today
      if (dayTs < cutoffTs || dayTs > yesterdayTs) continue;

      for (const [agentId, entry] of Object.entries(dayData.agents)) {
        const prev: Totals = agentTotals.get(agentId) ?? {
          profit: 0n,
          payout: 0n,
          mechRequests: 0,
        };
        prev.profit += BigInt(entry.profit);
        prev.payout += BigInt(entry.payout);
        prev.mechRequests += entry.mechRequests;
        agentTotals.set(agentId, prev);
      }
    }

    for (const [agentId, totals] of agentTotals.entries()) {
      // Activity threshold uses lifetime bets from traderAgents, not bets in
      // the window — the floor means "agent has enough history to be
      // statistically meaningful," which is a property of the agent, not the
      // window.
      const lifetimeBets = agentBlueprintData.allTimeAgents?.[agentId]?.totalBets ?? 0;
      if (lifetimeBets < MIN_TRADES_FOR_ROI_DISPLAY) {
        excludedLowActivity++;
        continue;
      }

      // 1. Scale everything to 18 decimals (USDC 10^6 * 10^12 = 10^18)
      const scaledPayout = totals.payout * scale;
      const scaledProfit = totals.profit * scale;

      // 2. Derive Trading Costs
      const tradingCosts = scaledPayout - scaledProfit;

      // Skip zero trading costs considering it as "not enough data"
      if (tradingCosts <= 0n) continue;

      // 3. Add Mech Fees
      const mechFees = BigInt(totals.mechRequests) * DEFAULT_MECH_FEE;
      const totalCosts = tradingCosts + mechFees;

      // 4. Net Gain = Profit (already scaled) - Mech Fees
      const netGain = scaledProfit - mechFees;

      // 5. Calculate ROI as percentage
      const roi = Number((netGain * 10000n) / totalCosts) / 100;

      const binIdx = assignBin(roi);
      if (binIdx !== -1) {
        binCounts[binIdx]++;
        activeAgents++;
      }
    }
  }

  const tabLabel = daysBack === null ? 'all' : `${daysBack}d`;
  console.log(
    `[roi-dist:${isPolystrat ? 'polystrat' : 'omenstrat'}:${tabLabel}] ` +
      `included=${activeAgents}, excluded_low_activity=${excludedLowActivity} ` +
      `(< ${MIN_TRADES_FOR_ROI_DISPLAY} bets)`
  );

  if (activeAgents === 0) return new Array<number>(ROI_BINS.length).fill(0);
  return binCounts.map((count) => Math.round((count / activeAgents) * 1000) / 10);
};

export const computeAllRangeHistograms = (
  omenData: AgentBlueprintRoiData | null,
  polyData: AgentBlueprintRoiData | null
): { d7: BinData[]; d30: BinData[]; d90: BinData[]; all: BinData[] } => {
  const empty = new Array<number>(ROI_BINS.length).fill(0);
  const ranges: Array<{ key: 'd7' | 'd30' | 'd90' | 'all'; days: number | null }> = [
    { key: 'd7', days: 7 },
    { key: 'd30', days: 30 },
    { key: 'd90', days: 90 },
    { key: 'all', days: null },
  ];

  const result: Record<string, BinData[]> = {};
  for (const { key, days } of ranges) {
    const omenBins = omenData ? computeAgentBlueprintHistogram(omenData, days, false) : empty;
    const polyBins = polyData ? computeAgentBlueprintHistogram(polyData, days, true) : empty;
    result[key] = ROI_BINS.map((bin, i) => ({
      label: bin.label,
      min: bin.min,
      max: bin.max,
      omenstrat: omenBins[i],
      polystrat: polyBins[i],
    }));
  }

  return result as { d7: BinData[]; d30: BinData[]; d90: BinData[]; all: BinData[] };
};
