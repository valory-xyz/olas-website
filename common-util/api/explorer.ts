import { OMENSTRAT_AGENT_CLASSIFICATION } from 'common-util/constants';
import { DaaSeriesPoint } from 'common-util/explorer';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { gql } from 'graphql-request';

/** Two aligned daily series (same dates, same length) for the Explorer heatmap. */
export type ExplorerSeries = {
  /** Daily Active Agents — active multisigs summed across the trader agents per day. */
  daa: DaaSeriesPoint[];
  /** On-chain transactions per day. */
  transactions: DaaSeriesPoint[];
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

// In-memory cache so dev (where getStaticProps re-runs per request) doesn't re-hit
// the subgraph on every refresh. Prod relies on ISR; this is per-process.
const CACHE_TTL_MS = 30 * 60 * 1000;
type SeriesCache = { at: number; result: MetricWithStatus<ExplorerSeries | null> };
// Stored on globalThis so the cache survives Next dev HMR recompiles (a module-level
// `let` resets on every edit). Prod relies on ISR.
const cacheHost = globalThis as typeof globalThis & { __aeeExplorerCache?: SeriesCache | null };

// The subgraph caps `first` at 1000, so we page through with skip. One row per
// (agent, day) → a few years × 2 trader agents fits in ~2 pages; cap as a backstop.
const PAGE_SIZE = 1000;
const MAX_PAGES = 8;

const explorerOmenstratSeriesQuery = gql`
  query ExplorerOmenstratSeries(
    $agentIds: [Int!]!
    $timestamp_gt: Int!
    $timestamp_lt: Int!
    $skip: Int!
  ) {
    dailyAgentPerformances(
      where: {
        and: [
          { agentId_in: $agentIds }
          { dayTimestamp_gt: $timestamp_gt }
          { dayTimestamp_lt: $timestamp_lt }
        ]
      }
      orderBy: dayTimestamp
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      dayTimestamp
      activeMultisigCount
      txCount
    }
    _meta {
      hasIndexingErrors
      block {
        number
      }
    }
  }
`;

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
): ExplorerSeries => {
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

/**
 * Fetch Omenstrat's full daily history as two aligned series (DAA + transactions)
 * for the Explorer heatmap. Queries the Gnosis registry subgraph directly (paged,
 * since it caps `first` at 1000) — it retains daily history, so no snapshot/cron.
 */
export const fetchOmenstratExplorerSeries = async (): Promise<
  MetricWithStatus<ExplorerSeries | null>
> => {
  const cached = cacheHost.__aeeExplorerCache;
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.result;

  const timestampLt = getMidnightUtcTimestampDaysAgo(0);
  const timestampGt = getMidnightUtcTimestampDaysAgo(SERIES_WINDOW_DAYS);

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

    const result = {
      value: transformExplorerSeries(rows, timestampGt, timestampLt),
      status: createStaleStatus({ indexingErrors, fetchErrors: [], laggingSubgraphs }),
    };
    cacheHost.__aeeExplorerCache = { at: Date.now(), result };
    return result;
  } catch (error) {
    console.error(`Error fetching from ${SOURCE}:`, error);
    // Stale-while-revalidate: the subgraph is flaky (504 / "database unavailable"),
    // so serve the last good result rather than blanking the page.
    if (cacheHost.__aeeExplorerCache) return cacheHost.__aeeExplorerCache.result;
    return { value: null, status: getFetchErrorAndCreateStaleStatus(SOURCE) };
  }
};
