import { OMENSTRAT_AGENT_CLASSIFICATION } from 'common-util/constants';
import { DaaSeriesPoint } from 'common-util/explorer';
import { predictAgentsGraphClient, REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  explorerOmenstratSeriesQuery,
  getExplorerBetsQuery,
  getExplorerDailyProfitStatsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

/** Registry-derived daily series (DAA + transactions), aligned to the same dates. */
type RegistrySeries = {
  /** Daily Active Agents — active multisigs summed across the trader agents per day. */
  daa: DaaSeriesPoint[];
  /** On-chain transactions per day. */
  transactions: DaaSeriesPoint[];
};

/** Every daily series the Explorer heatmap can render. */
export type ExplorerSeries = RegistrySeries & {
  /**
   * Prediction Accuracy — daily win-rate (%) of resolved bets. Sparse: only days
   * with at least MIN_BETS_PER_DAY resolved bets are included; thinner days are
   * omitted and render as no-data cells.
   */
  accuracy: DaaSeriesPoint[];
  /**
   * Return on Investment — daily partial ROI (%), `profit / (payout − profit)`
   * summed across agents. Can be negative. Sparse, bounded to a recent window
   * (ROI_WINDOW_DAYS) since the per-agent daily rows are high-volume.
   */
  roi: DaaSeriesPoint[];
};

type DailyOmenstratRow = {
  dayTimestamp: string;
  activeMultisigCount: number;
  txCount: string;
};

type DailyOmenstratResponse = WithMeta<{ dailyAgentPerformances: DailyOmenstratRow[] }>;

// Omenstrat trader agents on Gnosis — same selection the Predict page uses for DAA.
const OMENSTRAT_AGENT_IDS = OMENSTRAT_AGENT_CLASSIFICATION.valory_trader;
const CHAIN = 'gnosis';
const SOURCE = 'registry:gnosis:explorer';

// Wide enough to cover Omenstrat's first active day (~2023-11). The transform
// trims leading zero-days, so an over-wide window just self-trims to inception.
const SERIES_WINDOW_DAYS = 1200;
const ONE_DAY_SECONDS = 24 * 60 * 60;

// The proxy occasionally 504s on the heavier paged query — retry transient
// failures with backoff (a warm retry usually hits the subgraph's cache).
const REQUEST_ATTEMPTS = 2;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Retry a request with backoff — the predict-agents gateway occasionally
// rate-limits / 502s a page during a long backfill.
const requestWithRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(500 * attempt);
    }
  }
  throw lastError;
};

// The subgraph caps `first` at 1000, so we page through with skip. One row per
// (agent, day) → a few years × 2 trader agents fits in ~2 pages; cap as a backstop.
const PAGE_SIZE = 1000;
const MAX_PAGES = 8;

/**
 * Build two gap-filled daily series (DAA + transactions) from the per-agent daily
 * rows. The subgraph only emits a row per agent on days it was active, so a
 * missing day is genuinely zero — we fill those explicitly. Leading zero-days
 * (before first activity) are trimmed so both series start at inception.
 *
 * (DAA gap-fill / leading-trim logic adapted from Presh's transformDaaSeries.)
 */
const transformExplorerSeries = (
  rows: DailyOmenstratRow[],
  timestampGt: number,
  timestampLt: number
): RegistrySeries => {
  const daaByDay = new Map<string, number>();
  const txByDay = new Map<string, number>();

  rows.forEach((r) => {
    const date = new Date(Number(r.dayTimestamp) * 1000).toISOString().slice(0, 10);
    daaByDay.set(date, (daaByDay.get(date) || 0) + Number(r.activeMultisigCount || 0));
    txByDay.set(date, (txByDay.get(date) || 0) + Number(r.txCount || 0));
  });

  // Query bounds are exclusive, so covered days run from gt + 1 day up to (not incl.) lt.
  const daa: DaaSeriesPoint[] = [];
  const transactions: DaaSeriesPoint[] = [];
  for (let ts = timestampGt + ONE_DAY_SECONDS; ts < timestampLt; ts += ONE_DAY_SECONDS) {
    const date = new Date(ts * 1000).toISOString().slice(0, 10);
    daa.push({ date, count: daaByDay.get(date) || 0 });
    transactions.push({ date, count: txByDay.get(date) || 0 });
  }

  const firstActive = daa.findIndex((point) => point.count > 0);
  if (firstActive > 0) {
    return { daa: daa.slice(firstActive), transactions: transactions.slice(firstActive) };
  }
  return { daa, transactions };
};

// Registry-derived DAA + transactions (paged; the subgraph caps `first` at 1000).
const fetchRegistrySeries = async (
  timestampGt: number,
  timestampLt: number
): Promise<MetricWithStatus<RegistrySeries | null>> => {
  try {
    const rows: DailyOmenstratRow[] = [];
    let meta: DailyOmenstratResponse['_meta'];

    for (let page = 0; page < MAX_PAGES; page += 1) {
      let data: DailyOmenstratResponse | null = null;
      let lastError: unknown;
      for (let attempt = 1; attempt <= REQUEST_ATTEMPTS; attempt += 1) {
        try {
          data = (await REGISTRY_GRAPH_CLIENTS.gnosis.request(explorerOmenstratSeriesQuery, {
            agentIds: OMENSTRAT_AGENT_IDS,
            timestamp_gt: timestampGt,
            timestamp_lt: timestampLt,
            skip: page * PAGE_SIZE,
          })) as DailyOmenstratResponse;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < REQUEST_ATTEMPTS) await sleep(400 * attempt);
        }
      }
      if (!data) throw lastError;

      meta = data._meta;
      const pageRows = data.dailyAgentPerformances || [];
      rows.push(...pageRows);
      if (pageRows.length < PAGE_SIZE) break;
    }

    const chainBlock = await getChainBlockNumber(CHAIN);
    const indexingErrors = meta?.hasIndexingErrors ? [SOURCE] : [];
    const laggingSubgraphs = checkSubgraphLag(chainBlock, meta?.block?.number, CHAIN)
      ? [SOURCE]
      : [];

    return {
      value: transformExplorerSeries(rows, timestampGt, timestampLt),
      status: createStaleStatus({ indexingErrors, fetchErrors: [], laggingSubgraphs }),
    };
  } catch (error) {
    console.error(`Error fetching from ${SOURCE}:`, error);
    // Return null/stale; saveSnapshot's mergeWithFallback keeps the last good
    // series in the blob, so a flaky-subgraph run never blanks the page.
    return { value: null, status: getFetchErrorAndCreateStaleStatus(SOURCE) };
  }
};

// ── Prediction Accuracy (predict-agents subgraph) ────────────────────────────
const INVALID_ANSWER_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const ACCURACY_SOURCE = 'predict:gnosis:explorer-accuracy';
const ACCURACY_BET_PAGE_SIZE = 1000;
// Daily cron pages a shallow recent window (self-heals the last ~2 weeks); a one-time
// backfill passes a much larger count to reach deep history. Hard backstop on top.
const ACCURACY_DEFAULT_PAGES = 12;
const ACCURACY_MAX_PAGES = 800;
const ACCURACY_CURSOR_START = 4102444800; // year 2100 — newer than any bet
// Below this many resolved bets, a day's win-rate is statistical noise → omit it.
const MIN_BETS_PER_DAY = 10;

type ClosedBet = {
  timestamp: string;
  outcomeIndex: string;
  fixedProductMarketMaker: { currentAnswer: string } | null;
};

/**
 * Daily Prediction Accuracy — for each UTC day, the win-rate (%) of resolved bets
 * (same population as the Predict page's success-rate tile, just bucketed by day).
 * Pages from newest backward up to `maxPages` — shallow for the daily cron, deep for
 * a one-time backfill. Sparse: only days with ≥ MIN_BETS_PER_DAY resolved bets are
 * returned, so thin days render as no-data rather than a noisy 0%/100%.
 */
const fetchOmenstratDailyAccuracy = async (maxPages: number): Promise<DaaSeriesPoint[]> => {
  const bets: ClosedBet[] = [];
  const pages = Math.min(maxPages, ACCURACY_MAX_PAGES);
  let cursor = ACCURACY_CURSOR_START;
  for (let page = 0; page < pages; page += 1) {
    let pageRows: ClosedBet[];
    try {
      const data = (await requestWithRetry(() =>
        predictAgentsGraphClient.request(
          getExplorerBetsQuery({ first: ACCURACY_BET_PAGE_SIZE, timestamp_lt: cursor })
        )
      )) as { bets: ClosedBet[] };
      pageRows = data?.bets ?? [];
    } catch (error) {
      console.error(
        `${ACCURACY_SOURCE}: page ${page} failed after retries; keeping ${bets.length} bets`,
        error
      );
      break;
    }
    if (pageRows.length === 0) break;
    bets.push(...pageRows);
    // Next page: bets strictly older than the last (oldest) in this page.
    cursor = Number(pageRows[pageRows.length - 1].timestamp);
    if (pageRows.length < ACCURACY_BET_PAGE_SIZE) break;
  }

  const byDay = new Map<string, { correct: number; total: number }>();
  bets.forEach((bet) => {
    const answer = bet?.fixedProductMarketMaker?.currentAnswer;
    if (!answer || answer === INVALID_ANSWER_HEX) return;
    const date = new Date(Number(bet.timestamp) * 1000).toISOString().slice(0, 10);
    const entry = byDay.get(date) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (Number(answer) === Number(bet.outcomeIndex)) entry.correct += 1;
    byDay.set(date, entry);
  });

  return Array.from(byDay.entries())
    .filter(([, e]) => e.total >= MIN_BETS_PER_DAY)
    .map(([date, e]) => ({ date, count: Math.round((e.correct / e.total) * 100) }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// ── Return on Investment (predict-agents subgraph) ───────────────────────────
const ROI_SOURCE = 'predict:gnosis:explorer-roi';
const ROI_DEFAULT_WINDOW_DAYS = 30;
const ROI_PAGE_SIZE = 1000;
// dailyProfitStatistics is per-(agent, day) (~500 rows/day). We page the window in
// non-overlapping date-range chunks so each chunk's skip stays shallow — deep skip is
// O(skip) and The Graph rejects it (the same reason accuracy uses a cursor). 7 days ×
// ~500 rows ≈ 3.5k rows/chunk → max skip ~3k, comfortably under the gateway's cap.
const ROI_CHUNK_DAYS = 7;
const ROI_CHUNK_MAX_PAGES = 20;
// Below this many bets across all agents, a day's ROI is statistical noise → omit.
const MIN_BETS_PER_DAY_ROI = 20;

type DailyProfitRow = {
  date: string; // UTC-midnight unix timestamp (string)
  totalBets: string;
  totalPayout: string;
  dailyProfit: string;
};

/**
 * Daily Return on Investment — for each UTC day, partial ROI (%) across all trader
 * agents: `profit / cost`, with `cost = payout − profit` (the fields this subgraph
 * version exposes; the per-day traded+fees cost basis isn't available here). Can be
 * negative. Fetches a `windowDays` range — shallow for the cron, deep for a backfill.
 */
const fetchOmenstratDailyRoi = async (windowDays: number): Promise<DaaSeriesPoint[]> => {
  const newest = getMidnightUtcTimestampDaysAgo(0);
  const oldest = getMidnightUtcTimestampDaysAgo(windowDays);

  // Page the window in non-overlapping date-range chunks, newest → oldest. Each chunk's
  // skip stays shallow (no deep-skip rejection), and ranges don't overlap so a date's
  // per-agent rows are counted exactly once. On a chunk failure we keep what we have —
  // i.e. the most-recent chunks, never just the oldest.
  const rows: DailyProfitRow[] = [];
  let chunkLte = newest;
  while (chunkLte >= oldest) {
    const chunkGte = Math.max(oldest, chunkLte - (ROI_CHUNK_DAYS - 1) * ONE_DAY_SECONDS);
    let chunkFailed = false;
    for (let page = 0; page < ROI_CHUNK_MAX_PAGES; page += 1) {
      let pageRows: DailyProfitRow[];
      try {
        const data = (await requestWithRetry(() =>
          predictAgentsGraphClient.request(
            getExplorerDailyProfitStatsQuery({
              date_gte: chunkGte,
              date_lte: chunkLte,
              first: ROI_PAGE_SIZE,
              skip: page * ROI_PAGE_SIZE,
            })
          )
        )) as { dailyProfitStatistics: DailyProfitRow[] };
        pageRows = data?.dailyProfitStatistics ?? [];
      } catch (error) {
        console.error(
          `${ROI_SOURCE}: chunk ≤${chunkLte} page ${page} failed; keeping ${rows.length} rows`,
          error
        );
        chunkFailed = true;
        break;
      }
      rows.push(...pageRows);
      if (pageRows.length < ROI_PAGE_SIZE) break;
    }
    if (chunkFailed) break;
    chunkLte = chunkGte - ONE_DAY_SECONDS; // next chunk ends the day before this one
  }

  const byDay = new Map<string, { profit: bigint; payout: bigint; bets: number }>();
  rows.forEach((r) => {
    const date = new Date(Number(r.date) * 1000).toISOString().slice(0, 10);
    const entry = byDay.get(date) ?? { profit: 0n, payout: 0n, bets: 0 };
    entry.profit += BigInt(r.dailyProfit || '0');
    entry.payout += BigInt(r.totalPayout || '0');
    entry.bets += Number(r.totalBets || 0);
    byDay.set(date, entry);
  });

  const series: DaaSeriesPoint[] = [];
  byDay.forEach((entry, date) => {
    const cost = entry.payout - entry.profit;
    if (entry.bets < MIN_BETS_PER_DAY_ROI || cost <= 0n) return;
    series.push({ date, count: Math.round(Number((entry.profit * 10000n) / cost) / 100) });
  });
  return series.sort((a, b) => a.date.localeCompare(b.date));
};

export type ExplorerFetchOptions = {
  /** Prior stored series to merge fresh windows into — preserves a deep backfill. */
  previous?: ExplorerSeries | null;
  /** Accuracy bet pages to fetch (shallow cron default; large for a backfill). */
  accuracyPages?: number;
  /** ROI window in days (shallow cron default; large for a backfill). */
  roiDays?: number;
};

/**
 * Merge a freshly-fetched (recent) window into the stored full series: fresh days
 * overwrite the stored value (self-heal), genuinely new days append, and older
 * stored days are kept untouched. An empty `fresh` (failed fetch) keeps `previous`.
 */
const mergeSeries = (
  previous: DaaSeriesPoint[] | undefined,
  fresh: DaaSeriesPoint[]
): DaaSeriesPoint[] => {
  const byDate = new Map<string, number>();
  (previous ?? []).forEach((p) => byDate.set(p.date, p.count));
  fresh.forEach((p) => byDate.set(p.date, p.count));
  return Array.from(byDate, ([date, count]) => ({ date, count })).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

/**
 * Fetch Omenstrat's daily series for the Explorer heatmap: DAA + transactions from the
 * Gnosis registry subgraph (full, cheap), and Prediction Accuracy + ROI from the
 * predict-agents subgraph (a recent window, merged into the prior stored series so a
 * one-time deep backfill is preserved). Driven by the `refresh-metrics/explorer` cron.
 */
export const fetchOmenstratExplorerSeries = async (
  options: ExplorerFetchOptions = {}
): Promise<MetricWithStatus<ExplorerSeries | null>> => {
  const {
    previous = null,
    accuracyPages = ACCURACY_DEFAULT_PAGES,
    roiDays = ROI_DEFAULT_WINDOW_DAYS,
  } = options;

  const timestampLt = getMidnightUtcTimestampDaysAgo(0);
  const timestampGt = getMidnightUtcTimestampDaysAgo(SERIES_WINDOW_DAYS);

  // Fetch in parallel; isolate each predict-agents query's failure so a flaky run
  // never blanks DAA/Transactions (a failed accuracy/roi window keeps prior history).
  const [registry, accuracy, roi] = await Promise.all([
    fetchRegistrySeries(timestampGt, timestampLt),
    fetchOmenstratDailyAccuracy(accuracyPages).catch((error) => {
      console.error(`Error fetching ${ACCURACY_SOURCE}:`, error);
      return null;
    }),
    fetchOmenstratDailyRoi(roiDays).catch((error) => {
      console.error(`Error fetching ${ROI_SOURCE}:`, error);
      return null;
    }),
  ]);

  if (!registry.value) {
    return { value: null, status: registry.status };
  }

  return {
    value: {
      ...registry.value,
      // Window-merge into prior history: a failed fetch ([]) leaves `previous` intact.
      accuracy: mergeSeries(previous?.accuracy, accuracy ?? []),
      roi: mergeSeries(previous?.roi, roi ?? []),
    },
    // Registry drives staleness; accuracy/roi are best-effort.
    status: registry.status,
  };
};

/** Snapshot persisted to Vercel Blob under the `explorer` category. */
export type ExplorerMetricsData = {
  omenstrat: MetricWithStatus<ExplorerSeries | null>;
};

export type ExplorerMetricsSnapshot = {
  data: ExplorerMetricsData;
  timestamp: number;
};

/**
 * Build the Explorer snapshot. DAA/Transactions are full-refetched each run (cheap);
 * Accuracy/ROI fetch a recent window and merge into `options.previous` so a one-time
 * deep backfill is preserved. Pass large `accuracyPages`/`roiDays` for that backfill.
 */
export const fetchAllExplorerMetrics = async (
  options: ExplorerFetchOptions = {}
): Promise<ExplorerMetricsSnapshot | null> => {
  try {
    const omenstrat = await fetchOmenstratExplorerSeries(options);
    return { data: { omenstrat }, timestamp: Date.now() };
  } catch (error) {
    console.error('Error building explorer metrics snapshot:', error);
    return null;
  }
};
