import { polymarketAgentsGraphClient, predictAgentsGraphClient } from 'common-util/graphql/client';
import {
  checkSquidLag,
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import {
  getOmenDailyBrierStatsQuery,
  getPolymarketDailyBrierStatsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { OMEN_GENESIS_TS, POLYMARKET_GENESIS_TS } from './genesis';

export type WindowKey = '7d' | '30d' | '90d' | '365d';
export type WindowedMetric<T> = Record<WindowKey, T>;

const LIMIT = 1000;
const DAY = 86400;
const BRIER_SCALE = 10n ** 18n; // brierSum is 1e18-scaled (see predict-omen / squid schema)

// Days reprocessed at the head of the window every run. Captures newly-completed
// days plus late re-answers (the Omen subgraph moves Brier onto the new settlement
// day on a re-answer; overwriting these buckets keeps the all-time sum correct.
// Polymarket resolution is write-once, so there the trail only catches new days).
const TRAIL_DAYS = 10;
// One-time historical backfill step per run, walking from the head toward genesis.
const BACKFILL_CHUNK_DAYS = 30;

type DailyBrierStat = { date: string; brierSum: string; brierCount: number };
type OmenDailyBrierStatsResponse = WithMeta<{ dailyProfitStatistics: DailyBrierStat[] }>;
// The squid handles errors differently from a subgraph (it stops advancing instead of
// erroring), so freshness comes from squidStatus.height via a lag check.
type PolymarketDailyBrierStatsResponse = {
  dailyProfitStatistics: DailyBrierStat[];
  squidStatus?: { height: number };
};

type DayBucket = { sum: bigint; count: number };

// JSON-safe bucket: BigInt sum stored as a decimal string.
type BrierBucket = { sum: string; count: number };
type BrierAccumulator = {
  // dayTimestamp (UTC midnight, string) -> settlement-day Brier accumulators,
  // summed across all trader agents. Contiguous over [backfilledTo, coveredTo].
  buckets: Record<string, BrierBucket>;
  // Oldest day processed so far. Window N is "covered" once backfilledTo <= its
  // cutoff, clamped to the platform's genesis day (see windowCutoff).
  backfilledTo: number;
  // Newest day processed so far. Lets the head refresh bridge any gap (e.g. a
  // cron outage longer than the trailing window) instead of silently skipping days.
  coveredTo: number;
};

export const emptyWindows = (): WindowedMetric<number | null> => ({
  '7d': null,
  '30d': null,
  '90d': null,
  '365d': null,
});

// First day of an N-day window ending yesterday, clamped to genesis: a platform younger
// than the window has no earlier days, so its whole history is the window.
export const windowCutoff = (yesterday: number, days: number, genesisDay: number): number =>
  Math.max(genesisDay, yesterday - (days - 1) * DAY);

// meanBrier = sum(brierSum) / sum(brierCount), 1e18-scaled -> [0, 1]. Keep 4
// decimals of precision before downcasting to a JS number.
const meanBrier = (sum: bigint, count: number): number | null =>
  count === 0 ? null : Number((sum * 10000n) / BigInt(count) / BRIER_SCALE) / 10000;

// Sum the rows of one page into perDay, keyed by settlement day.
const accumulateRows = (perDay: Map<number, DayBucket>, rows: DailyBrierStat[]) => {
  for (const row of rows) {
    const count = Number(row.brierCount || 0);
    if (count === 0) continue;
    const day = Number(row.date);
    const cur = perDay.get(day) || { sum: 0n, count: 0 };
    cur.sum += BigInt(row.brierSum || 0);
    cur.count += count;
    perDay.set(day, cur);
  }
};

// Fetches and groups dailyProfitStatistics in [startDay, endDay] by settlement day,
// summing brierSum/brierCount across all agents. Bounded by the day range, so it
// never grows unboundedly. Mutates indexingErrors/laggingSubgraphs as a side effect.
type FetchDayBuckets = (
  startDay: number,
  endDay: number,
  chainBlock: number | null,
  indexingErrors: string[],
  laggingSubgraphs: string[]
) => Promise<Map<number, DayBucket>>;

const fetchOmenDayBuckets: FetchDayBuckets = async (
  startDay,
  endDay,
  chainBlock,
  indexingErrors,
  laggingSubgraphs
) => {
  const perDay = new Map<number, DayBucket>();
  if (startDay > endDay) return perDay;

  let skip = 0;
  let metaChecked = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await predictAgentsGraphClient.request(
      getOmenDailyBrierStatsQuery({ date_gte: startDay, date_lte: endDay, first: LIMIT, skip })
    )) as OmenDailyBrierStatsResponse;

    if (!metaChecked) {
      if (response?._meta?.hasIndexingErrors) indexingErrors.push('predict:gnosis');
      if (chainBlock && checkSubgraphLag(chainBlock, response?._meta?.block?.number, 'gnosis')) {
        laggingSubgraphs.push('predict:gnosis');
      }
      metaChecked = true;
    }

    const rows = response?.dailyProfitStatistics || [];
    accumulateRows(perDay, rows);

    if (rows.length < LIMIT) break;
    skip += LIMIT;
  }
  return perDay;
};

const fetchPolyDayBuckets: FetchDayBuckets = async (
  startDay,
  endDay,
  chainBlock,
  indexingErrors,
  laggingSubgraphs
) => {
  const perDay = new Map<number, DayBucket>();
  if (startDay > endDay) return perDay;

  let skip = 0;
  let metaChecked = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await polymarketAgentsGraphClient.request(
      getPolymarketDailyBrierStatsQuery({
        date_gte: startDay,
        date_lte: endDay,
        first: LIMIT,
        skip,
      })
    )) as PolymarketDailyBrierStatsResponse;

    if (!metaChecked) {
      checkSquidLag(
        chainBlock,
        response?.squidStatus?.height,
        'polygon',
        laggingSubgraphs,
        'predict:polygon'
      );
      metaChecked = true;
    }

    const rows = response?.dailyProfitStatistics || [];
    accumulateRows(perDay, rows);

    if (rows.length < LIMIT) break;
    skip += LIMIT;
  }
  return perDay;
};

// Self-contained incremental accumulator persisted in its own blob. The hourly
// predict refresh advances it a little each run instead of rescanning the whole
// daily-stats history on every call. Structurally identical to buildWindowedAccuracy
// (see accuracy.ts) — only the per-day math differs.
const buildWindowedBrier = async (
  category: string,
  chain: 'gnosis' | 'polygon',
  genesisDay: number,
  source: string,
  fetchDayBuckets: FetchDayBuckets
): Promise<MetricWithStatus<WindowedMetric<number | null>>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  // Only complete days are settled; today is excluded so windows mean "last N
  // full days" (consistent with roi-distribution's window convention).
  const yesterday = getMidnightUtcTimestampDaysAgo(1);

  let existing: BrierAccumulator | null = null;
  try {
    const snapshot = await getSnapshot({ category });
    existing = (snapshot?.data as unknown as BrierAccumulator) ?? null;
  } catch (e) {
    console.warn(`Could not load Brier accumulator (${category}); rebuilding from scratch`, e);
  }

  try {
    const chainBlock = await getChainBlockNumber(chain);

    const buckets: Record<string, BrierBucket> = { ...(existing?.buckets ?? {}) };
    // Sentinel for a fresh accumulator: nothing processed yet (just above the head).
    let backfilledTo = existing?.backfilledTo ?? yesterday + DAY;
    // Treat a fresh accumulator as "caught up to yesterday" so the head refresh is
    // just the trailing window and history is filled by the backward backfill.
    const prevCoveredTo = existing?.coveredTo ?? yesterday;

    const applyBuckets = (perDay: Map<number, DayBucket>) => {
      for (const [day, { sum, count }] of perDay.entries()) {
        buckets[String(day)] = { sum: sum.toString(), count };
      }
    };

    // 1. Head refresh up to yesterday. Normally this is just the trailing window
    //    (new complete days + late re-answers). If a cron outage left coveredTo
    //    well below yesterday, headStart drops to bridge the gap — no missed days.
    const trailStart = yesterday - (TRAIL_DAYS - 1) * DAY;
    const headStart = Math.max(
      genesisDay,
      Math.min(trailStart, prevCoveredTo - (TRAIL_DAYS - 1) * DAY)
    );
    applyBuckets(
      await fetchDayBuckets(headStart, yesterday, chainBlock, indexingErrors, laggingSubgraphs)
    );
    backfilledTo = Math.min(backfilledTo, headStart);

    // 2. Historical backfill: extend the covered range one chunk toward genesis.
    if (backfilledTo > genesisDay) {
      const hi = backfilledTo - DAY;
      const lo = Math.max(genesisDay, backfilledTo - BACKFILL_CHUNK_DAYS * DAY);
      applyBuckets(await fetchDayBuckets(lo, hi, chainBlock, indexingErrors, laggingSubgraphs));
      backfilledTo = lo;
    }

    // Sum stored buckets whose day falls in [fromDay, toDay].
    const rangeSum = (fromDay: number, toDay: number) => {
      let sum = 0n;
      let count = 0;
      for (const [k, v] of Object.entries(buckets)) {
        const day = Number(k);
        if (day >= fromDay && day <= toDay) {
          sum += BigInt(v.sum);
          count += v.count;
        }
      }
      return { sum, count };
    };

    // A window is only published once its full range is covered; otherwise null
    // (so mergeWithFallback keeps the previous value rather than an understated one).
    const windowValue = (days: number): number | null => {
      const cutoff = windowCutoff(yesterday, days, genesisDay);
      if (backfilledTo > cutoff) return null;
      const { sum, count } = rangeSum(cutoff, yesterday);
      return meanBrier(sum, count);
    };

    const fullyBackfilled = backfilledTo <= genesisDay;

    // Persist the advanced accumulator (overwrite — this is authoritative state,
    // not a metric that benefits from mergeWithFallback).
    await saveSnapshot({
      category,
      data: {
        data: { buckets, backfilledTo, coveredTo: yesterday } as BrierAccumulator,
        timestamp: Date.now(),
      },
      overwrite: true,
    });

    // While still backfilling, flag stale so the parent snapshot's mergeWithFallback
    // serves the last fully-computed value during the one-time catch-up after deploy.
    if (!fullyBackfilled) fetchErrors.push(`${source}:brier:backfilling`);

    return {
      value: {
        '7d': windowValue(7),
        '30d': windowValue(30),
        '90d': windowValue(90),
        '365d': windowValue(365),
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error(`Error fetching Brier score (${category}):`, error);
    // Don't persist a partial advance; return stale so the previous value is kept.
    fetchErrors.push(`${source}:brier`);
    return {
      value: emptyWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};

export const fetchOmenstratBrier = (): Promise<MetricWithStatus<WindowedMetric<number | null>>> =>
  buildWindowedBrier(
    'predict-brier/omenstrat',
    'gnosis',
    OMEN_GENESIS_TS,
    'omenstrat',
    fetchOmenDayBuckets
  );

export const fetchPolystratBrier = (): Promise<MetricWithStatus<WindowedMetric<number | null>>> =>
  buildWindowedBrier(
    'predict-brier/polystrat',
    'polygon',
    POLYMARKET_GENESIS_TS,
    'polystrat',
    fetchPolyDayBuckets
  );
