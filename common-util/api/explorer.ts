import { OMENSTRAT_AGENT_CLASSIFICATION } from 'common-util/constants';
import { DaaSeriesPoint } from 'common-util/explorer';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { explorerOmenstratSeriesQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

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
 * since it caps `first` at 1000). Called once a day by the `refresh-metrics/explorer`
 * cron, which persists the result to a Vercel Blob snapshot that the page reads.
 */
export const fetchOmenstratExplorerSeries = async (): Promise<
  MetricWithStatus<ExplorerSeries | null>
> => {
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

/** Snapshot persisted to Vercel Blob under the `explorer` category. */
export type ExplorerMetricsData = {
  omenstrat: MetricWithStatus<ExplorerSeries | null>;
};

export type ExplorerMetricsSnapshot = {
  data: ExplorerMetricsData;
  timestamp: number;
};

/**
 * Build the Explorer snapshot for the daily `refresh-metrics/explorer` cron.
 *
 * Today this does a full-history refetch — cheap (~2 paged requests) and
 * self-healing (re-fetching recent days corrects lag/re-index gaps). If the
 * history ever gets large, swap `fetchOmenstratExplorerSeries` for a trailing-
 * window fetch that merges into the previous blob; this builder stays the same.
 */
export const fetchAllExplorerMetrics = async (): Promise<ExplorerMetricsSnapshot | null> => {
  try {
    const omenstrat = await fetchOmenstratExplorerSeries();
    return { data: { omenstrat }, timestamp: Date.now() };
  } catch (error) {
    console.error('Error building explorer metrics snapshot:', error);
    return null;
  }
};
