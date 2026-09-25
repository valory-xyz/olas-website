import { DEFAULT_MECH_FEE, QMR_MAX_AGE_DAYS } from 'common-util/constants';
import {
  MARKETPLACE_GRAPH_CLIENTS,
  polymarketAgentsGraphClient,
  predictAgentsGraphClient,
} from 'common-util/graphql/client';
import {
  getMarketplaceSendersQuery,
  getMechRequestsIncrementalQuery,
  getMechRequestsInRangeQuery,
  getOmenDailyProfitStatsQuery,
  getOmenTraderAgentsQuery,
  getPolymarketDailyProfitStatsQuery,
  getPolymarketQuestionTitlesQuery,
  getPolymarketTraderAgentsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

import {
  GNOSIS_MECH_REQUESTS_GENESIS_TS,
  OMEN_GENESIS_TS,
  POLYGON_MECH_REQUESTS_GENESIS_TS,
  POLYMARKET_GENESIS_TS,
} from './genesis';
import { USE_MECH_ANALYTICS, fetchMechRequestsFromAnalytics } from './mech-analytics';
import { mergeQmr, roiPercent, senderLifetimeRequests, windowedNetGainAndCosts } from './roi-math';

const LIMIT = 1000;
// conditionIds per getPolymarketQuestionTitlesQuery batch (keeps the inlined
// id_in list well under request-size limits).
const TITLE_BATCH_SIZE = 500;
// Process at most this many days per cron run to stay within timeout
const MAX_DAYS_PER_RUN = 30;
const DAY_SECONDS = 86400;
// Keep only this many days in byDay (covers the longest tab: 365D, plus one day of
// slack between UTC midnight and the daily cron run)
const BYDAY_RETENTION_DAYS = 366;
// QMR_MAX_AGE_DAYS (common-util/constants.ts): age-out TTL for pending QMR
// entries (markets resolve in ~4 days); shared with the mech-analytics client.

// Minimum lifetime bets before an agent's ROI is included in the histogram.
// Mirrors trader's MIN_TRADES_FOR_ROI_DISPLAY — low-activity agents (1-2 bets)
// produce statistically meaningless ROIs that distort the tails.
export const MIN_TRADES_FOR_ROI_DISPLAY = 10;

const dayKeyOf = (ts: number): string => String(Math.floor(ts / DAY_SECONDS) * DAY_SECONDS);

// Blobs written before `historyFrom` existed were pruned to this many days, counted
// back from the run after `lastDayTimestamp`.
const LEGACY_RETENTION_DAYS = 90;

const legacyHistoryFrom = (data: AgentBlueprintRoiData): number =>
  data.lastDayTimestamp + DAY_SECONDS - LEGACY_RETENTION_DAYS * DAY_SECONDS;

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
  /**
   * mech-analytics path only — see docs/mech-analytics-migration.md
   * When missing, the next flag-on run rebuilds the open set.
   */
  mechAnalytics?: {
    /** Last seen computed_at watermark. */
    lastComputedAt: string;
    /** Ids of rows we already counted (request_id → requested_at, unix seconds). */
    ingestedRequestIds: Record<string, number>;
  };
};

/** Per-agent daily aggregates, used for every range ('d7' … 'd365') */
export type DailyAgentEntry = {
  profit: string;
  payout: string;
  /**
   * Total mech request count resolved at the time markets settled or payed out.
   * Deduplicated: an agent placing multiple bets on the same market counts that
   * market's requests entry once, not once per bet.
   */
  mechRequests: number;
  /**
   * Cost basis of bets that *settled* on this day — the denominator for
   * windowed ROI (`payout - profit` derivation is wrong here: the money fields
   * land on different days). Omenstrat values are 18 decimals (stake + fees);
   * polystrat values are USDC 1e6, scaled at read time.
   */
  tradedSettled?: string;
  // Omenstrat-only (no per-trade fees on Polymarket).
  feesSettled?: string;
};

/**
 * Per-agent all-time aggregates. Only `totalBets` is read today — the lifetime activity
 * floor (MIN_TRADES_FOR_ROI_DISPLAY). Every published range is summed from `byDay`.
 */
export type AllTimeAgentEntry = {
  // Expected payout projected at market resolution (accrual basis), 1e18-scaled.
  // See docs/predict-roi-accounting.md.
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
  /**
   * Oldest day `byDay` holds complete data for. A range is only published once it
   * reaches back this far (see `isRoiWindowCovered`); before that it would be summed
   * over fewer days than its label says. Missing on blobs written before the 365D
   * range — derived from the oldest `byDay` key on the next run.
   */
  historyFrom?: number;
  /**
   * Days before this were backfilled by `backfillRoiHistory` rather than processed
   * live, so their `mechRequests` come from a replay (polystrat) or an estimate of one
   * request per bet (omenstrat). See docs/predict-roi-accounting.md.
   */
  backfilledBefore?: number;
  allTimeAgents: Record<string, AllTimeAgentEntry>; // agentId → all-time totals
  /**
   * Subgraph fetches that failed during the run that wrote this blob
   * ('daily-stats' | 'all-time-agents' | 'mech-requests'). Consumers (windowed
   * ROI) surface these as MetricWithStatus fetchErrors so the UI can flag
   * staleness — a blob written by a failing run is otherwise indistinguishable
   * from a healthy one.
   */
  fetchErrors?: string[];
  /**
   * Mech-request attribution counters from the run that wrote this blob:
   * `matched` requests were consumed onto settlement days, `flushed` were
   * TTL-expired onto their request day, `ingested` were added this run
   * (post-dedupe, so the counters reconcile against `openRequests`), and
   * `openRequests` remain pending. Windowed ROI raises a staleness flag (on
   * booked mech cost stays implausibly low while trading is active.
   */
  mechAttribution?: {
    matched: number;
    flushed: number;
    ingested: number;
    openRequests: number;
    runAt: number;
  };
};

// ─── Internal query types ────────────────────────────────────────────────────

type DailyStatEntry = {
  traderAgent: { id: string };
  date: string;
  totalBets: number;
  totalPayout: string;
  dailyProfit: string;
  dailyTradedSettled?: string;
  // Omenstrat-only (the polymarket squid has no per-trade fees).
  dailyFeesSettled?: string;
  profitParticipants: Array<{ question?: string; metadata?: { title: string } }>;
};

// Raw squid row: profitParticipants is a list of conditionId strings, resolved
// to titles (getPolymarketQuestionTitlesQuery) before entering the shared shape.
type PolystratRawDailyStatEntry = Omit<DailyStatEntry, 'profitParticipants'> & {
  profitParticipants: string[];
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
  totalExpectedPayout: string;
  totalBets: string;
};

type PolyTraderAgentEntry = {
  id: string;
  totalTradedSettled: string;
  totalExpectedPayout: string;
  totalBets: string;
};

type SenderEntry = {
  id: string;
  totalLegacyRequests: string;
};

// ─── Daily stat fetchers ─────────────────────────────────────────────────────

// `ok: false` means a page failed mid-pagination — the stats are incomplete and
// the caller must NOT advance its day cursor past this range, or the failed days
// would be skipped forever (the cursor only moves forward).
type DailyStatsResult = { stats: DailyStatEntry[]; ok: boolean };

const fetchOmenstratDailyStats = async (
  dayStartTs: number,
  dayEndTs: number
): Promise<DailyStatsResult> => {
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
      return { stats: results, ok: false };
    }
  }
  return { stats: results, ok: true };
};

const fetchPolystratDailyStats = async (
  dayStartTs: number,
  dayEndTs: number
): Promise<DailyStatsResult> => {
  const raw: PolystratRawDailyStatEntry[] = [];
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
      )) as { dailyProfitStatistics: PolystratRawDailyStatEntry[] };
      const page = response?.dailyProfitStatistics ?? [];
      raw.push(...page);
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error('Error fetching Polystrat daily stats', e);
      return { stats: [], ok: false };
    }
  }

  // Resolve profitParticipants conditionIds to market titles (used downstream
  // for QMR consumption). Ids without a title are rejected because they can't
  // match a mech-request.
  const ids = new Set<string>();
  for (const stat of raw) for (const id of stat.profitParticipants ?? []) ids.add(id);

  const titleById = new Map<string, string>();
  const idList = [...ids];
  for (let i = 0; i < idList.length; i += TITLE_BATCH_SIZE) {
    try {
      const response = (await polymarketAgentsGraphClient.request(
        getPolymarketQuestionTitlesQuery(idList.slice(i, i + TITLE_BATCH_SIZE))
      )) as { questions: Array<{ id: string; metadata?: { title: string } }> };
      for (const q of response?.questions ?? []) {
        if (q.metadata?.title) titleById.set(q.id, q.metadata.title);
      }
    } catch (e) {
      console.error('Error fetching Polystrat question titles', e);
      return { stats: [], ok: false };
    }
  }

  if (idList.length > 0 && titleById.size === 0) {
    console.error(
      `Polystrat question-title lookup resolved 0 of ${idList.length} conditionIds — treating as a fetch failure`
    );
    return { stats: [], ok: false };
  }

  const stats: DailyStatEntry[] = raw.map((stat) => ({
    ...stat,
    profitParticipants: (stat.profitParticipants ?? [])
      .filter((id) => titleById.has(id))
      .map((id) => ({ metadata: { title: titleById.get(id) as string } })),
  }));
  return { stats, ok: true };
};

// ─── Incremental mech request fetcher ────────────────────────────────────────

/**
 * Fetches Mech requests from the Marketplace subgraph that occurred after lastTimestamp (recorder in blob).
 * Returns a nested mapping: { [marketTitle]: { [agentId]: totalRequests } }.
 */
const fetchIncrementalMechRequests = async (
  chain: 'gnosis' | 'polygon',
  lastTimestamp: number
): Promise<{
  additions: Record<string, Record<string, number[]>>;
  lastTimestamp: number;
  ok: boolean;
}> => {
  // FIX-1: additions now stores timestamps per (title, agentId), not just counts.
  const additions: Record<string, Record<string, number[]>> = {};
  let latestTs = lastTimestamp;
  let skip = 0;
  let ok = true;
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
      // Partial additions are safe to keep: latestTs only reflects rows actually
      // fetched, so the next run resumes from there. Report the failure so it
      // isn't invisible.
      ok = false;
      break;
    }
  }
  return { additions, lastTimestamp: latestTs, ok };
};

// ─── All-time agent data fetcher ─────────────────────────────────────────────

/**
 * Fetches all-time trader agent totals and marketplace sender totals.
 * Uses remaining QMR (open markets only) to subtract open-market requests from senderTotal.
 */
const fetchAllTimeAgents = async (
  agentBlueprint: 'omenstrat' | 'polystrat',
  openQmr: Record<string, Record<string, number[]>>
): Promise<{ agents: Record<string, AllTimeAgentEntry>; ok: boolean }> => {
  const chain: 'gnosis' | 'polygon' = agentBlueprint === 'omenstrat' ? 'gnosis' : 'polygon';
  const SCALE = agentBlueprint === 'polystrat' ? BigInt('1000000000000') : 1n;
  // A failed page means incomplete (or empty) totals — the caller keeps the
  // previous run's allTimeAgents instead of overwriting them with a truncation.
  let ok = true;

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
            // Accrual basis — payout projected at settlement, same as dailyProfit.
            payout: BigInt(agent.totalExpectedPayout) * SCALE,
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
            // Accrual basis — payout projected at settlement, same as dailyProfit.
            payout: BigInt(agent.totalExpectedPayout) * SCALE,
            tradingCosts: BigInt(agent.totalTradedSettled) * SCALE,
            totalBets: Number(agent.totalBets ?? 0),
          });
        }
      }
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error(`Error fetching traderAgents for ${agentBlueprint}`, e);
      ok = false;
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
        senderMap.set(agentId, senderLifetimeRequests(sender));
      }
      if (page.length < LIMIT) break;
      skip += LIMIT;
    } catch (e) {
      console.error(`Error fetching senders for ${agentBlueprint}`, e);
      ok = false;
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

  return { agents: allTimeAgents, ok };
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

/**
 * Consumes the open QMR entries for every market this agent's stat settled, and returns
 * how many requests that booked onto the settlement day (product intent: all market
 * costs are grouped on the day the market settles, not on the day the request was
 * made). Shared by the daily run and the history backfill so both match titles the
 * same way.
 */
const consumeSettledRequests = (
  qmr: Record<string, Record<string, number[]>>,
  normalizedQmrMap: Map<string, string>,
  stat: DailyStatEntry,
  agentId: string,
  keysUsed: Set<string>
): number => {
  // Unique titles from the predict subgraph
  const uniqueTitles = new Set<string>();
  for (const p of stat.profitParticipants ?? []) {
    const title = p.question ?? p.metadata?.title;
    if (title) uniqueTitles.add(title);
  }

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
      keysUsed.add(matchedKey);
    }
  }
  return mechRequests;
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
  let qmr = normalizeQmrShape(
    existingQmr?.questionMechRequests as
      | Record<string, Record<string, number[] | number>>
      | undefined,
    existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs
  );
  // Subgraph failures during this run — persisted on the blob so downstream
  // consumers can surface staleness instead of trusting silently-empty data.
  const runFetchErrors: string[] = [];

  let additions: Record<string, Record<string, number[]>> = {};
  let newMechTs = existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs;
  let mechRequestsOk = false;
  let wasRebuild = false;
  // Saved only while the flag is on. A flag-off run drops it, so turning
  // the flag on again starts with a fresh rebuild. An old watermark could
  // count the same rows twice.
  let newMechAnalytics: QmrData['mechAnalytics'];

  if (USE_MECH_ANALYTICS) {
    const result = await fetchMechRequestsFromAnalytics(
      chain,
      existingQmr?.mechAnalytics?.lastComputedAt,
      existingQmr?.mechAnalytics?.ingestedRequestIds,
      newMechTs
    );
    // null = the rebuild failed; keep everything as it is and retry next run.
    mechRequestsOk = result !== null && (result.kind === 'rebuild' || result.ok);
    if (result !== null) {
      wasRebuild = result.kind === 'rebuild';
      additions = result.additions;
      newMechTs = result.lastTimestamp;
      newMechAnalytics = {
        lastComputedAt: result.lastComputedAt,
        ingestedRequestIds: result.ingestedRequestIds,
      };
    }
  } else {
    ({
      additions,
      lastTimestamp: newMechTs,
      ok: mechRequestsOk,
    } = await fetchIncrementalMechRequests(
      chain,
      existingQmr?.lastMechRequestTimestamp ?? mechGenesisTs
    ));
  }
  if (!mechRequestsOk) runFetchErrors.push('mech-requests');
  // A rebuild's window overlaps requests already in the open set — dedupe them;
  // an incremental batch is already deduplicated by request id upstream.
  // `added` is post-dedupe, so mechAttribution counters reconcile.
  const { merged, added: ingestedCount } = mergeQmr(qmr, additions, wasRebuild);
  qmr = merged;

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
  // Attribution counters — persisted as mechAttribution for observability.
  let matchedCount = 0;
  let flushedCount = 0;

  if (startDay <= endDay) {
    const totalDays = Math.floor((endDay - startDay) / DAY_SECONDS) + 1;
    const daysToProcess = Math.min(totalDays, MAX_DAYS_PER_RUN);
    const processEndDay = startDay + (daysToProcess - 1) * DAY_SECONDS;

    const fetchStats =
      agentBlueprint === 'omenstrat' ? fetchOmenstratDailyStats : fetchPolystratDailyStats;
    const { stats: allStats, ok: statsOk } = await fetchStats(startDay, processEndDay);

    if (!statsOk) {
      // Incomplete stats: apply nothing and do NOT advance lastDayTimestamp. The
      // day cursor only ever moves forward, so advancing past an incomplete fetch
      // would permanently exclude those days from byDay. Leaving the cursor in
      // place means the whole chunk is retried on the next run.
      runFetchErrors.push('daily-stats');
    } else {
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

          const mechRequests = consumeSettledRequests(
            qmr,
            normalizedQmrMap,
            stat,
            agentId,
            qmrKeysUsedThisDay
          );
          matchedCount += mechRequests;

          agents[agentId] = {
            profit: stat.dailyProfit,
            payout: stat.totalPayout,
            mechRequests,
            tradedSettled: stat.dailyTradedSettled ?? '0',
            ...(agentBlueprint === 'omenstrat'
              ? { feesSettled: stat.dailyFeesSettled ?? '0' }
              : {}),
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
      flushedCount = expiredCount;
      if (expiredCount > 0) {
        console.log(
          `[roi-dist:${agentBlueprint}] expired ${expiredCount} QMR entries older than ${QMR_MAX_AGE_DAYS} days`
        );
      }
    }
  }

  // 3: Prune byDay to BYDAY_RETENTION_DAYS
  const retentionCutoff = getMidnightUtcTimestampDaysAgo(0) - BYDAY_RETENTION_DAYS * DAY_SECONDS;
  for (const dayKey of Object.keys(byDay)) {
    if (Number(dayKey) < retentionCutoff) delete byDay[dayKey];
  }
  // A fresh blob is complete from genesis; an older one from where the 90-day
  // pruning left it (legacyHistoryFrom).
  const historyFrom = Math.max(
    retentionCutoff,
    existing ? (existing.historyFrom ?? legacyHistoryFrom(existing)) : genesisTs
  );

  // 4: Recompute all-time agents (fresh each run). On fetch failure keep the
  // previous run's totals — overwriting them with a truncated (often empty) map
  // would null the Max-window ROI and the all-time histogram until the next
  // fully-successful run.
  const { agents: fetchedAllTimeAgents, ok: allTimeOk } = await fetchAllTimeAgents(
    agentBlueprint,
    qmr
  );
  const allTimeAgents = allTimeOk ? fetchedAllTimeAgents : (existing?.allTimeAgents ?? {});
  if (!allTimeOk) runFetchErrors.push('all-time-agents');

  let openRequests = 0;
  for (const agentLists of Object.values(qmr)) {
    for (const tsList of Object.values(agentLists)) openRequests += tsList?.length ?? 0;
  }
  const mechAttribution = {
    matched: matchedCount,
    flushed: flushedCount,
    ingested: ingestedCount,
    openRequests,
    runAt: Math.floor(Date.now() / 1000),
  };
  console.log(
    `[roi-dist:${agentBlueprint}] mech attribution: ingested=${ingestedCount} ` +
      `matched=${matchedCount} flushed=${flushedCount} open=${openRequests}`
  );

  return {
    mainData: {
      byDay,
      lastDayTimestamp,
      historyFrom,
      backfilledBefore: existing?.backfilledBefore,
      allTimeAgents,
      fetchErrors: runFetchErrors,
      mechAttribution,
    },
    qmrData: {
      questionMechRequests: qmr,
      lastMechRequestTimestamp: newMechTs,
      mechAnalytics: newMechAnalytics,
    },
  };
};

// ─── One-off 365D history backfill ───────────────────────────────────────────

// Days per Omenstrat backfill chunk. Small, so the time budget packs chunks tightly:
// the request scan reads every Gnosis mech request (~15k a day), not only Omenstrat's.
const HISTORY_CHUNK_DAYS = 5;
// Stop starting new chunks after this long, leaving headroom in the 300s function.
const HISTORY_TIME_BUDGET_MS = 180_000;

type MechRequestInRange = MechRequestEntry & { id: string };

// Walks every mech request in [fromTs, toTs) once, oldest first. `false` on any failed
// page — a partial scan would undercount, so callers write nothing for the range.
const scanMechRequests = async (
  chain: 'gnosis' | 'polygon',
  fromTs: number,
  toTs: number,
  onRequest: (agentId: string, questionTitle: string | null, ts: number) => void
): Promise<boolean> => {
  const seen = new Set<string>();
  const client = MARKETPLACE_GRAPH_CLIENTS[chain];
  let cursor = fromTs;

  while (true) {
    let page: MechRequestInRange[] | null = null;
    // One retry: a scan is thousands of pages, and a single gateway blip would
    // otherwise throw away the whole chunk.
    for (let attempt = 1; page === null; attempt++) {
      try {
        const response = (await client.request(
          getMechRequestsInRangeQuery({ timestamp_gte: cursor, timestamp_lt: toTs, first: LIMIT })
        )) as { requests: MechRequestInRange[] };
        page = response?.requests ?? [];
      } catch (e) {
        console.error(`Error fetching mech requests in range for ${chain} (try ${attempt})`, e);
        if (attempt >= 2) return false;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    for (const req of page) {
      if (seen.has(req.id)) continue;
      seen.add(req.id);
      const agentId = req.sender?.id?.toLowerCase();
      const ts = Number(req.blockTimestamp ?? 0);
      if (!agentId || ts <= 0) continue;
      onRequest(agentId, req.parsedRequest?.questionTitle ?? null, ts);
    }

    if (page.length < LIMIT) return true;
    const lastTs = Number(page[page.length - 1].blockTimestamp);
    if (lastTs <= cursor) {
      // A full page on a single second: the cursor can't advance past it.
      console.error(`mech request cursor stuck at ${cursor} on ${chain}`);
      return false;
    }
    // `gte` re-reads the last second, so siblings split across the boundary are kept;
    // the id set drops the rows read twice.
    cursor = lastTs;
  }
};

const statsByDayKey = (stats: DailyStatEntry[]) => {
  const out = new Map<string, DailyStatEntry[]>();
  for (const stat of stats) {
    const list = out.get(String(stat.date)) ?? [];
    list.push(stat);
    out.set(String(stat.date), list);
  }
  return out;
};

const toDailyEntry = (
  stat: DailyStatEntry,
  mechRequests: number,
  isPolystrat: boolean
): DailyAgentEntry => ({
  profit: stat.dailyProfit,
  payout: stat.totalPayout,
  mechRequests,
  tradedSettled: stat.dailyTradedSettled ?? '0',
  ...(isPolystrat ? {} : { feesSettled: stat.dailyFeesSettled ?? '0' }),
});

/**
 * Omenstrat: walks back from `historyFrom` in chunks until the 365D range start or the
 * time budget. Each day's mech requests are the trader agents' requests the marketplace
 * subgraph recorded that day — booked on the request day rather than matched to the
 * settlement day as the live run does. Matching needs a forward pass over the open
 * requests, which Omen's volume (~2.5M Gnosis requests over the gap) can't fit in one
 * call; markets settle within ~4 days, so a 365-day total barely moves.
 */
const backfillOmenstratHistory = async (
  byDay: AgentBlueprintRoiData['byDay'],
  historyFrom: number,
  floor: number,
  traders: Set<string>
): Promise<{ historyFrom: number; ok: boolean }> => {
  const startedAt = Date.now();
  let from = historyFrom;
  while (from > floor && Date.now() - startedAt < HISTORY_TIME_BUDGET_MS) {
    const hi = from - DAY_SECONDS;
    const lo = Math.max(floor, from - HISTORY_CHUNK_DAYS * DAY_SECONDS);

    // dayKey → agentId → requests made that day
    const requestsByDay = new Map<string, Map<string, number>>();
    const [{ stats, ok: statsOk }, requestsOk] = await Promise.all([
      fetchOmenstratDailyStats(lo, hi),
      scanMechRequests('gnosis', lo, hi + DAY_SECONDS, (agentId, _title, ts) => {
        if (!traders.has(agentId)) return;
        const dayMap = requestsByDay.get(dayKeyOf(ts)) ?? new Map<string, number>();
        dayMap.set(agentId, (dayMap.get(agentId) ?? 0) + 1);
        requestsByDay.set(dayKeyOf(ts), dayMap);
      }),
    ]);
    // Incomplete: write nothing for this chunk and leave historyFrom where it is.
    if (!statsOk || !requestsOk) return { historyFrom: from, ok: false };

    const byKey = statsByDayKey(stats);
    for (let dayTs = lo; dayTs <= hi; dayTs += DAY_SECONDS) {
      const dayRequests = requestsByDay.get(String(dayTs)) ?? new Map<string, number>();
      const agents: Record<string, DailyAgentEntry> = {};
      for (const stat of byKey.get(String(dayTs)) ?? []) {
        const agentId = stat.traderAgent.id.toLowerCase();
        agents[agentId] = toDailyEntry(stat, dayRequests.get(agentId) ?? 0, false);
      }
      // Requests on a day the agent settled nothing still cost (the live run's TTL
      // flush books these the same way).
      for (const [agentId, count] of dayRequests) {
        if (!agents[agentId]) agents[agentId] = { profit: '0', payout: '0', mechRequests: count };
      }
      if (Object.keys(agents).length > 0) byDay[String(dayTs)] = { agents };
      else delete byDay[String(dayTs)];
    }
    from = lo;
  }
  return { historyFrom: from, ok: true };
};

/**
 * Polystrat: replays the daily run's request matching over the whole gap in one pass —
 * the same ingest, settlement-day match and TTL flush, fed from the marketplace
 * subgraph's per-request records instead of the live feed. Off-chain requests have no
 * such record, so days that had any are undercounted by those.
 *
 * Requests still open at `historyFrom` are dropped: the live run already booked them
 * onto a day at or after it, or flushed them onto a day it has since pruned.
 */
const backfillPolystratHistory = async (
  byDay: AgentBlueprintRoiData['byDay'],
  historyFrom: number,
  floor: number
): Promise<{ historyFrom: number; ok: boolean }> => {
  const hi = historyFrom - DAY_SECONDS;
  const ttl = QMR_MAX_AGE_DAYS * DAY_SECONDS;
  // Ingested in request order, day by day, as the live run would have seen them.
  // Untitled requests are skipped, as the live ingest skips them.
  const pending: Array<{ title: string; agentId: string; ts: number }> = [];
  const [statsResult, requestsOk] = await Promise.all([
    fetchPolystratDailyStats(floor, hi),
    // Requests made up to a TTL before the range can still settle inside it.
    scanMechRequests('polygon', floor - ttl, historyFrom, (agentId, title, ts) => {
      if (title) pending.push({ title, agentId, ts });
    }),
  ]);
  if (!statsResult.ok || !requestsOk) return { historyFrom, ok: false };
  pending.sort((a, b) => a.ts - b.ts);

  const qmr: Record<string, Record<string, number[]>> = {};
  const normalizedQmrMap = new Map<string, string>();
  const days: Record<string, Record<string, DailyAgentEntry>> = {};
  const ensureEntry = (dKey: string, aid: string): DailyAgentEntry => {
    if (!days[dKey]) days[dKey] = {};
    if (!days[dKey][aid]) days[dKey][aid] = { profit: '0', payout: '0', mechRequests: 0 };
    return days[dKey][aid];
  };
  // TTL flush onto the request day, as the live run does. Requests made before the
  // range are dropped — their day is outside it.
  const flushOlderThan = (cutoff: number) => {
    for (const [title, agentMap] of Object.entries(qmr)) {
      for (const [agentId, tsList] of Object.entries(agentMap)) {
        const kept = tsList.filter((ts) => ts >= cutoff);
        for (const ts of tsList) {
          if (ts < cutoff && ts >= floor) ensureEntry(dayKeyOf(ts), agentId).mechRequests++;
        }
        if (kept.length === 0) delete agentMap[agentId];
        else agentMap[agentId] = kept;
      }
      if (Object.keys(agentMap).length === 0) {
        delete qmr[title];
        normalizedQmrMap.delete(normalizeTitle(title));
      }
    }
  };

  const byKey = statsByDayKey(statsResult.stats);
  let next = 0;
  for (let dayTs = floor; dayTs <= hi; dayTs += DAY_SECONDS) {
    // Requests made by the end of this day are known when its settlements are matched.
    while (next < pending.length && pending[next].ts < dayTs + DAY_SECONDS) {
      const { title, agentId, ts } = pending[next++];
      if (!qmr[title]) qmr[title] = {};
      if (!qmr[title][agentId]) qmr[title][agentId] = [];
      qmr[title][agentId].push(ts);
      normalizedQmrMap.set(normalizeTitle(title), title);
    }

    const keysUsed = new Set<string>();
    for (const stat of byKey.get(String(dayTs)) ?? []) {
      const agentId = stat.traderAgent.id.toLowerCase();
      const matched = consumeSettledRequests(qmr, normalizedQmrMap, stat, agentId, keysUsed);
      // A TTL flush may already have booked requests on this day for this agent.
      const flushed = days[String(dayTs)]?.[agentId]?.mechRequests ?? 0;
      ensureEntry(String(dayTs), agentId); // creates the day's map
      days[String(dayTs)][agentId] = toDailyEntry(stat, matched + flushed, true);
    }
    flushOlderThan(dayTs + DAY_SECONDS - ttl);
  }

  for (let dayTs = floor; dayTs <= hi; dayTs += DAY_SECONDS) {
    const agents = days[String(dayTs)];
    if (agents && Object.keys(agents).length > 0) byDay[String(dayTs)] = { agents };
    else delete byDay[String(dayTs)];
  }
  return { historyFrom: floor, ok: true };
};

/**
 * Fills `byDay` back to the start of the 365D range, which the live run never kept
 * (it pruned at 90 days until the 365D tab). One-off: run it by hand after deploy via
 * `/api/refresh-metrics/predict-roi-distribution?agent=<agent>&backfillHistory=1`,
 * repeating while `remainingDays > 0`. Touches only days before `historyFrom`, never
 * the day cursor or the open-request set. See docs/predict-roi-accounting.md.
 */
export const backfillRoiHistory = async (
  agentBlueprint: 'omenstrat' | 'polystrat',
  existing: AgentBlueprintRoiData
): Promise<{ mainData: AgentBlueprintRoiData; ok: boolean; remainingDays: number }> => {
  const isPolystrat = agentBlueprint === 'polystrat';
  const floor = windowStart(365, isPolystrat);
  const historyFrom = existing.historyFrom ?? legacyHistoryFrom(existing);
  const byDay = { ...existing.byDay };

  let result = { historyFrom, ok: true };
  if (historyFrom > floor) {
    result = isPolystrat
      ? await backfillPolystratHistory(byDay, historyFrom, floor)
      : await backfillOmenstratHistory(
          byDay,
          historyFrom,
          floor,
          // Mech senders are the trader agents' own addresses.
          new Set(Object.keys(existing.allTimeAgents ?? {}).map((id) => id.toLowerCase()))
        );
  }

  console.log(
    `[roi-dist:${agentBlueprint}] history backfill ok=${result.ok} ` +
      `historyFrom=${result.historyFrom} floor=${floor}`
  );

  return {
    mainData: {
      ...existing,
      byDay,
      historyFrom: result.historyFrom,
      // The first backfill marks where live data starts; later runs keep it.
      backfilledBefore:
        existing.backfilledBefore ?? (historyFrom > floor ? historyFrom : undefined),
    },
    ok: result.ok,
    remainingDays: Math.max(0, (result.historyFrom - floor) / DAY_SECONDS),
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

export type RangeKey = 'd7' | 'd30' | 'd90' | 'd365';

/** What the Predict page reads: the per-range histograms plus their net-positive shares. */
export type RoiDistribution = {
  bins: Record<RangeKey, BinData[]>;
  netPositive: Record<RangeKey, { omenstrat: NetPositive; polystrat: NetPositive }>;
};

/**
 * Share of agents in the range whose ROI is above zero, alongside the histogram
 * the same pass produces. `null` when no agent cleared the activity threshold —
 * distinct from a genuine 0% (every agent under water).
 */
export type NetPositive = { rate: number | null; agents: number };

type HistogramResult = { bins: number[]; netPositiveRate: number | null; agents: number };

const emptyHistogram = (): HistogramResult => ({
  bins: new Array<number>(ROI_BINS.length).fill(0),
  netPositiveRate: null,
  agents: 0,
});

const assignBin = (roi: number): number =>
  ROI_BINS.findIndex((bin) => roi >= bin.min && roi < bin.max);

type WindowTotals = {
  profit: bigint;
  payout: bigint;
  mechRequests: number;
  tradedSettled: bigint;
  feesSettled: bigint; // omenstrat only — 0n for polystrat
};

const genesisOf = (isPolystrat: boolean) => (isPolystrat ? POLYMARKET_GENESIS_TS : OMEN_GENESIS_TS);

/**
 * First day of a `daysBack`-day range ending yesterday. Clamped to genesis: a platform
 * younger than the range has no earlier days, so its whole history is the range.
 */
const windowStart = (daysBack: number, isPolystrat: boolean): number =>
  Math.max(
    genesisOf(isPolystrat),
    getMidnightUtcTimestampDaysAgo(1) - (daysBack - 1) * DAY_SECONDS
  );

/**
 * True once `byDay` reaches back to the start of the range. An uncovered range is not
 * published — summed over fewer days than its label, it would be a different number
 * under the same name. Until the one-off history backfill runs, this is what keeps
 * 365D at `--`.
 */
export const isRoiWindowCovered = (
  data: AgentBlueprintRoiData,
  daysBack: number,
  isPolystrat: boolean
): boolean => {
  const from = data.historyFrom ?? legacyHistoryFrom(data);
  return from <= windowStart(daysBack, isPolystrat);
};

// Per-agent totals of the `byDay` buckets in [windowStart, yesterday].
const sumWindowByAgent = (
  data: AgentBlueprintRoiData,
  daysBack: number,
  isPolystrat: boolean
): Map<string, WindowTotals> => {
  const yesterdayTs = getMidnightUtcTimestampDaysAgo(1);
  const cutoffTs = windowStart(daysBack, isPolystrat);
  const agentTotals = new Map<string, WindowTotals>();

  for (const [dayKeyStr, dayData] of Object.entries(data.byDay)) {
    const dayTs = Number(dayKeyStr);
    // Counts [daysBack] full days excluding today
    if (dayTs < cutoffTs || dayTs > yesterdayTs) continue;

    for (const [agentId, entry] of Object.entries(dayData.agents)) {
      const prev: WindowTotals = agentTotals.get(agentId) ?? {
        profit: 0n,
        payout: 0n,
        mechRequests: 0,
        tradedSettled: 0n,
        feesSettled: 0n,
      };
      prev.profit += BigInt(entry.profit);
      prev.payout += BigInt(entry.payout);
      prev.mechRequests += entry.mechRequests;
      if (entry.tradedSettled) prev.tradedSettled += BigInt(entry.tradedSettled);
      if (entry.feesSettled) prev.feesSettled += BigInt(entry.feesSettled);
      agentTotals.set(agentId, prev);
    }
  }
  return agentTotals;
};

const computeAgentBlueprintHistogram = (
  agentBlueprintData: AgentBlueprintRoiData,
  daysBack: number,
  isPolystrat: boolean
): HistogramResult => {
  if (!isRoiWindowCovered(agentBlueprintData, daysBack, isPolystrat)) return emptyHistogram();

  const binCounts = new Array<number>(ROI_BINS.length).fill(0);
  let activeAgents = 0;
  let netPositiveAgents = 0;
  let excludedLowActivity = 0;

  const scale = isPolystrat ? BigInt('1000000000000') : 1n; // Scale USDC (6) to WEI (18)
  const agentTotals = sumWindowByAgent(agentBlueprintData, daysBack, isPolystrat);

  for (const [agentId, totals] of agentTotals.entries()) {
    // Activity threshold uses lifetime bets from traderAgents, not bets in
    // the window — the floor means "agent has enough history to be
    // statistically meaningful," which is a property of the agent, not the
    // window. Only apply the threshold when a lifetime total is present;
    // a missing entry (partial allTimeAgents snapshot) shouldn't silently
    // drop the agent and risk emptying the histogram.
    const lifetimeEntry = agentBlueprintData.allTimeAgents?.[agentId];
    if (lifetimeEntry !== undefined && lifetimeEntry.totalBets < MIN_TRADES_FOR_ROI_DISPLAY) {
      excludedLowActivity++;
      continue;
    }

    // Settlement-day cost basis, scaled to 18 decimals (polystrat entries are
    // USDC 1e6, scale = 1e12; feesSettled is 0 there — no per-trade fees).
    const tradingCosts = (totals.tradedSettled + totals.feesSettled) * scale;

    // Skip zero trading costs considering it as "not enough data"
    if (tradingCosts <= 0n) continue;

    const { netGain, totalCosts } = windowedNetGainAndCosts({
      profit: totals.profit,
      tradedSettled: totals.tradedSettled,
      feesSettled: totals.feesSettled,
      mechRequests: totals.mechRequests,
      scale,
      mechFeeWei: DEFAULT_MECH_FEE,
    });
    const roi = roiPercent(netGain, totalCosts);

    const binIdx = assignBin(roi);
    if (binIdx !== -1) {
      binCounts[binIdx]++;
      activeAgents++;
      if (roi > 0) netPositiveAgents++;
    }
  }

  console.log(
    `[roi-dist:${isPolystrat ? 'polystrat' : 'omenstrat'}:${daysBack}d] ` +
      `included=${activeAgents}, excluded_low_activity=${excludedLowActivity} ` +
      `(< ${MIN_TRADES_FOR_ROI_DISPLAY} bets)`
  );

  if (activeAgents === 0) return emptyHistogram();
  return {
    bins: binCounts.map((count) => Math.round((count / activeAgents) * 1000) / 10),
    // Counted off the raw ROIs rather than by summing the >= 0 bins: the bin
    // shares are rounded to 0.1pp each, and ~20 of them compound into a
    // visibly wrong headline. Left unrounded here — a caller deriving a ratio
    // from it would otherwise round twice.
    netPositiveRate: (netPositiveAgents / activeAgents) * 100,
    agents: activeAgents,
  };
};

/**
 * Protocol-aggregate (dollar-weighted) net gain and total costs over a window, summed
 * across ALL agents with positive trading costs. Powers the windowed Performance ROI.
 *
 * Mirrors the per-agent cost/netGain math in `computeAgentBlueprintHistogram`, but
 * aggregates into one ratio instead of binning — and intentionally OMITS the
 * `MIN_TRADES_FOR_ROI_DISPLAY` activity filter: dollar weighting already de-emphasises
 * tiny agents, and the Performance headline is a whole-economy figure, not a per-agent
 * distribution. Keep the formulas in sync with the histogram.
 *
 * Sums the `byDay` buckets in the window; an uncovered window returns zero costs, which
 * callers publish as `null`. Results are 1e18-scaled (USDC 1e6 × 1e12 for polystrat).
 * partialRoi% = netGain / totalCosts × 100; finalRoi adds staking rewards (USD) to the
 * numerator.
 */
export const computeWindowedNetGainAndCosts = (
  data: AgentBlueprintRoiData,
  daysBack: number,
  isPolystrat: boolean
): { netGain: bigint; totalCosts: bigint } => {
  let netGain = 0n;
  let totalCosts = 0n;
  // INVARIANT: the largest tab (365D) must fit inside byDay's retention, i.e.
  // daysBack <= BYDAY_RETENTION_DAYS. Lower it below 365 and historyFrom moves up
  // with the pruning, so 365D silently stops being published.
  if (!isRoiWindowCovered(data, daysBack, isPolystrat)) return { netGain, totalCosts };

  const scale = isPolystrat ? BigInt('1000000000000') : 1n; // USDC 1e6 → 1e18

  for (const totals of sumWindowByAgent(data, daysBack, isPolystrat).values()) {
    // Same cost basis as the histogram: settled fields summed over the window
    // (polystrat's are USDC 1e6 → scaled; feesSettled is 0 there).
    const tradingCosts = (totals.tradedSettled + totals.feesSettled) * scale;
    if (tradingCosts <= 0n) continue;
    const agent = windowedNetGainAndCosts({
      profit: totals.profit,
      tradedSettled: totals.tradedSettled,
      feesSettled: totals.feesSettled,
      mechRequests: totals.mechRequests,
      scale,
      mechFeeWei: DEFAULT_MECH_FEE,
    });
    netGain += agent.netGain;
    totalCosts += agent.totalCosts;
  }
  return { netGain, totalCosts };
};

export const computeAllRangeHistograms = (
  omenData: AgentBlueprintRoiData | null,
  polyData: AgentBlueprintRoiData | null
): RoiDistribution => {
  const ranges: Array<{ key: RangeKey; days: number }> = [
    { key: 'd7', days: 7 },
    { key: 'd30', days: 30 },
    { key: 'd90', days: 90 },
    { key: 'd365', days: 365 },
  ];

  const bins = {} as Record<RangeKey, BinData[]>;
  const netPositive = {} as Record<RangeKey, { omenstrat: NetPositive; polystrat: NetPositive }>;
  for (const { key, days } of ranges) {
    const omen = omenData
      ? computeAgentBlueprintHistogram(omenData, days, false)
      : emptyHistogram();
    const poly = polyData ? computeAgentBlueprintHistogram(polyData, days, true) : emptyHistogram();
    bins[key] = ROI_BINS.map((bin, i) => ({
      label: bin.label,
      min: bin.min,
      max: bin.max,
      omenstrat: omen.bins[i],
      polystrat: poly.bins[i],
    }));
    netPositive[key] = {
      omenstrat: { rate: omen.netPositiveRate, agents: omen.agents },
      polystrat: { rate: poly.netPositiveRate, agents: poly.agents },
    };
  }

  return { bins, netPositive };
};
