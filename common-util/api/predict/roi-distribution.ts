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

// Genesis timestamps (UTC midnight) for each agent type
const OMEN_GENESIS_TS = 1763769600;
const POLYMARKET_GENESIS_TS = 1768867200;
// Earliest block timestamp to consider when fetching mech requests
const GNOSIS_MECH_REQUESTS_GENESIS_TS = 1763078400;
const POLYGON_MECH_REQUESTS_GENESIS_TS = 1763078400;

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
export type QmrData = {
  questionMechRequests: Record<string, Record<string, number>>; // title → agentId → count
  lastMechRequestTimestamp: number;
};

/** Per-agent daily aggregates, used for 'd7' | 'd30' | 'd90' distributions */
export type DailyAgentEntry = {
  bets: number;
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
};

type PolyTraderAgentEntry = {
  id: string;
  totalTradedSettled: string;
  totalPayout: string;
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
): Promise<{ additions: Record<string, Record<string, number>>; lastTimestamp: number }> => {
  const additions: Record<string, Record<string, number>> = {};
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
        if (!agentId || !questionTitle) continue;
        if (!additions[questionTitle]) additions[questionTitle] = {};
        additions[questionTitle][agentId] = (additions[questionTitle][agentId] ?? 0) + 1;
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
  openQmr: Record<string, Record<string, number>>
): Promise<Record<string, AllTimeAgentEntry>> => {
  const chain: 'gnosis' | 'polygon' = agentBlueprint === 'omenstrat' ? 'gnosis' : 'polygon';
  const SCALE = agentBlueprint === 'polystrat' ? BigInt('1000000000000') : 1n;

  // 1. Paginate traderAgents from predict subgraph (Settled Volume)
  const agentMap = new Map<string, { payout: bigint; tradingCosts: bigint }>();
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
          agentMap.set(agentId, { payout: BigInt(agent.totalPayout) * SCALE, tradingCosts });
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
  // Because the main loop zeroed out settled agents, any non-zero count here
  // represents a market that hasn't settled/payout yet.
  const openRequests: Record<string, number> = {};
  for (const agentCounts of Object.values(openQmr)) {
    for (const [agentId, count] of Object.entries(agentCounts)) {
      openRequests[agentId] = (openRequests[agentId] ?? 0) + count;
    }
  }

  // 4. Final Assembly
  // We only include agents that have at least some "Settled" trading costs.
  // This prevents "Unclaimed Wins" or "Inactive Signups" from appearing as -100% ROI.
  const allTimeAgents: Record<string, AllTimeAgentEntry> = {};

  for (const [agentId, { payout, tradingCosts }] of agentMap.entries()) {
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
  const qmr: Record<string, Record<string, number>> = {
    ...(existingQmr?.questionMechRequests ?? {}),
  };
  const { additions, lastTimestamp: newMechTs } = await fetchIncrementalMechRequests(
    chain,
    existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs
  );
  for (const [title, agentCounts] of Object.entries(additions)) {
    if (!qmr[title]) qmr[title] = {};
    for (const [agentId, count] of Object.entries(agentCounts)) {
      qmr[title][agentId] = (qmr[title][agentId] ?? 0) + count;
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
  const endDay = getMidnightUtcTimestampDaysAgo(0); // today

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

        let mechRequests = 0;
        for (const title of uniqueTitles) {
          // Try exact match first, then normalized prefix match
          let matchedKey = qmr[title] ? title : null;
          if (!matchedKey) {
            matchedKey = normalizedQmrMap.get(normalizeTitle(title)) ?? null;
          }

          if (matchedKey && qmr[matchedKey]?.[agentId]) {
            mechRequests += qmr[matchedKey][agentId];

            // Zero out to prevent double counting on future settlements/payouts
            // Covers for multiple bets on the same markets
            qmr[matchedKey][agentId] = 0;
            qmrKeysUsedThisDay.add(matchedKey);
          }
        }

        agents[agentId] = {
          bets: Number(stat.totalBets),
          profit: stat.dailyProfit,
          payout: stat.totalPayout,
          mechRequests,
        };
      }

      if (Object.keys(agents).length > 0) {
        byDay[dayKey] = { agents };
      }

      // Cleanup QMR: Delete title if all agent counts are zeroed
      for (const key of qmrKeysUsedThisDay) {
        if (qmr[key]) {
          const remaining = Object.values(qmr[key]).reduce((sum, v) => sum + v, 0);
          if (remaining === 0) {
            delete qmr[key];
            normalizedQmrMap.delete(normalizeTitle(key));
          }
        }
      }
    }

    lastDayTimestamp = processEndDay;
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
  { label: '< -100%', min: -Infinity, max: -100 },
  ...generateFineGrainedBins(-100, 100, 10), // Generates 20 bins: -100 to -90, ..., 90 to 100
  { label: '100% to 150%', min: 100, max: 150 },
  { label: '150% to 200%', min: 150, max: 200 },
  { label: '> 200%', min: 200, max: Infinity },
];

export type BinData = {
  label: string;
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

  if (daysBack === null) {
    // "All" range: already scaled in fetchAllTimeAgents
    for (const entry of Object.values(agentBlueprintData.allTimeAgents ?? {})) {
      const payout = BigInt(entry.payout);
      const tradingCosts = BigInt(entry.tradingCosts);

      // mechFees are already 18 decimals (USD/ETH/XDAI equivalent)
      const mechFees = BigInt(entry.mechRequests) * DEFAULT_MECH_FEE;
      const totalCosts = tradingCosts + mechFees;
      activeAgents++;

      // ROI = (Payout - TotalCosts) / TotalCosts
      const roi = Number(((payout - totalCosts) * 10000n) / totalCosts) / 100;

      // Skip absolute minimum of ROI considering it as "not enough data"
      if (roi === -100) continue;

      // Otherwise add to bin
      const binIdx = assignBin(roi);
      if (binIdx !== -1) binCounts[binIdx]++;
    }
  } else {
    // 7D / 30D / 90D
    const scale = isPolystrat ? BigInt('1000000000000') : 1n; // Scale USDC (6) to WEI (18)
    const todayTs = getMidnightUtcTimestampDaysAgo(0);
    const cutoffTs = todayTs - daysBack * DAY_SECONDS;

    const agentTotals = new Map<string, { profit: bigint; payout: bigint; mechRequests: number }>();

    for (const [dayKeyStr, dayData] of Object.entries(agentBlueprintData.byDay)) {
      if (Number(dayKeyStr) < cutoffTs) continue;
      for (const [agentId, entry] of Object.entries(dayData.agents)) {
        const prev = agentTotals.get(agentId) ?? { profit: 0n, payout: 0n, mechRequests: 0 };
        prev.profit += BigInt(entry.profit);
        prev.payout += BigInt(entry.payout);
        prev.mechRequests += entry.mechRequests;
        agentTotals.set(agentId, prev);
      }
    }

    for (const totals of agentTotals.values()) {
      // 1. Scale everything to 18 decimals (USDC 10^6 * 10^12 = 10^18)
      const scaledPayout = totals.payout * scale;
      const scaledProfit = totals.profit * scale;

      // 2. Derive Trading Costs
      const tradingCosts = scaledPayout - scaledProfit;
      if (tradingCosts <= 0n) continue;

      // 3. Add Mech Fees
      const mechFees = BigInt(totals.mechRequests) * DEFAULT_MECH_FEE;
      const totalInvestment = tradingCosts + mechFees;
      activeAgents++;

      // 4. Net Gain = Profit (already scaled) - Mech Fees
      const netGain = scaledProfit - mechFees;

      // 5. Calculate ROI as percentage
      const roi = Number((netGain * 10000n) / totalInvestment) / 100;

      // Skip absolute minimum of ROI considering it as "not enough data"
      if (roi === -100) continue;

      // Otherwise add to bin
      const binIdx = assignBin(roi);
      if (binIdx !== -1) binCounts[binIdx]++;
    }
  }

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
      omenstrat: omenBins[i],
      polystrat: polyBins[i],
    }));
  }

  return result as { d7: BinData[]; d30: BinData[]; d90: BinData[]; all: BinData[] };
};
