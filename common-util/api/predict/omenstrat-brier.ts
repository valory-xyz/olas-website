import { predictAgentsGraphClient } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import { getOmenDailyBrierStatsQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

export type WindowKey = '7d' | '30d' | '90d' | 'max';
export type WindowedMetric<T> = Record<WindowKey, T>;

const LIMIT = 1000;
const DAY = 86400;
const BRIER_SCALE = 10n ** 18n; // brierSum is 1e18-scaled (see predict-omen schema)

// UTC-midnight genesis day of the predict-omen subgraph (mirrors OMEN_GENESIS_TS
// in roi-distribution.ts). Backfill walks down to here, no further.
const OMEN_GENESIS_DAY = 1763769600;

// Days reprocessed at the head of the window every run. Captures newly-completed
// days plus late re-answers (the subgraph moves Brier onto the new settlement day
// on a re-answer; overwriting these buckets keeps the all-time sum correct).
const TRAIL_DAYS = 10;
// One-time historical backfill step per run, walking from the head toward genesis.
const BACKFILL_CHUNK_DAYS = 30;

// Self-contained incremental accumulator persisted in its own blob. The hourly
// predict refresh advances it a little each run instead of rescanning all of
// history (60k+ daily rows and growing) on every call.
const ACCUMULATOR_CATEGORY = 'predict-brier/omenstrat';

type DailyBrierStat = { date: string; brierSum: string; brierCount: number };
type DailyBrierStatsResponse = WithMeta<{ dailyProfitStatistics: DailyBrierStat[] }>;

// JSON-safe bucket: BigInt sum stored as a decimal string.
type BrierBucket = { sum: string; count: number };
type BrierAccumulator = {
  // dayTimestamp (UTC midnight, string) -> settlement-day Brier accumulators,
  // summed across all trader agents. Contiguous over [backfilledTo, yesterday].
  buckets: Record<string, BrierBucket>;
  // Oldest day processed so far. Window N is "covered" once backfilledTo <= its
  // cutoff; Max is covered once backfilledTo <= OMEN_GENESIS_DAY.
  backfilledTo: number;
};

export const emptyWindows = (): WindowedMetric<number | null> => ({
  '7d': null,
  '30d': null,
  '90d': null,
  max: null,
});

// meanBrier = sum(brierSum) / sum(brierCount), 1e18-scaled -> [0, 1]. Keep 4
// decimals of precision before downcasting to a JS number.
const meanBrier = (sum: bigint, count: number): number | null =>
  count === 0 ? null : Number((sum * 10000n) / BigInt(count) / BRIER_SCALE) / 10000;

// Fetch and group dailyProfitStatistics in [startDay, endDay] by settlement day,
// summing brierSum/brierCount across all agents. Bounded by the day range, so it
// never grows unboundedly. Mutates indexingErrors/laggingSubgraphs as a side effect.
const fetchDayBuckets = async (
  startDay: number,
  endDay: number,
  gnosisBlock: number | null,
  indexingErrors: string[],
  laggingSubgraphs: string[]
): Promise<Map<number, { sum: bigint; count: number }>> => {
  const perDay = new Map<number, { sum: bigint; count: number }>();
  if (startDay > endDay) return perDay;

  let skip = 0;
  let metaChecked = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await predictAgentsGraphClient.request(
      getOmenDailyBrierStatsQuery({ date_gte: startDay, date_lte: endDay, first: LIMIT, skip })
    )) as DailyBrierStatsResponse;

    if (!metaChecked) {
      if (response?._meta?.hasIndexingErrors) indexingErrors.push('predict:gnosis');
      if (gnosisBlock && checkSubgraphLag(gnosisBlock, response?._meta?.block?.number, 'gnosis')) {
        laggingSubgraphs.push('predict:gnosis');
      }
      metaChecked = true;
    }

    const rows = response?.dailyProfitStatistics || [];
    for (const row of rows) {
      const count = Number(row.brierCount || 0);
      if (count === 0) continue;
      const day = Number(row.date);
      const cur = perDay.get(day) || { sum: 0n, count: 0 };
      cur.sum += BigInt(row.brierSum || 0);
      cur.count += count;
      perDay.set(day, cur);
    }

    if (rows.length < LIMIT) break;
    skip += LIMIT;
  }
  return perDay;
};

export const fetchOmenstratBrier = async (): Promise<
  MetricWithStatus<WindowedMetric<number | null>>
> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  // Only complete days are settled; today is excluded so windows mean "last N
  // full days" (consistent with roi-distribution's window convention).
  const yesterday = getMidnightUtcTimestampDaysAgo(1);

  let existing: BrierAccumulator | null = null;
  try {
    const snapshot = await getSnapshot({ category: ACCUMULATOR_CATEGORY });
    existing = (snapshot?.data as unknown as BrierAccumulator) ?? null;
  } catch (e) {
    console.warn('Could not load Brier accumulator; rebuilding from scratch', e);
  }

  try {
    const gnosisBlock = await getChainBlockNumber('gnosis');

    const buckets: Record<string, BrierBucket> = { ...(existing?.buckets ?? {}) };
    // Sentinel for a fresh accumulator: nothing processed yet (just above the head).
    let backfilledTo = existing?.backfilledTo ?? yesterday + DAY;

    const applyBuckets = (perDay: Map<number, { sum: bigint; count: number }>) => {
      for (const [day, { sum, count }] of perDay.entries()) {
        buckets[String(day)] = { sum: sum.toString(), count };
      }
    };

    // 1. Head refresh: reprocess the trailing window (new complete days + re-answers).
    const trailStart = Math.max(OMEN_GENESIS_DAY, yesterday - (TRAIL_DAYS - 1) * DAY);
    applyBuckets(
      await fetchDayBuckets(trailStart, yesterday, gnosisBlock, indexingErrors, laggingSubgraphs)
    );
    backfilledTo = Math.min(backfilledTo, trailStart);

    // 2. Historical backfill: extend the covered range one chunk toward genesis.
    if (backfilledTo > OMEN_GENESIS_DAY) {
      const hi = backfilledTo - DAY;
      const lo = Math.max(OMEN_GENESIS_DAY, backfilledTo - BACKFILL_CHUNK_DAYS * DAY);
      applyBuckets(await fetchDayBuckets(lo, hi, gnosisBlock, indexingErrors, laggingSubgraphs));
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
      const cutoff = yesterday - (days - 1) * DAY;
      if (backfilledTo > cutoff) return null;
      const { sum, count } = rangeSum(cutoff, yesterday);
      return meanBrier(sum, count);
    };

    const fullyBackfilled = backfilledTo <= OMEN_GENESIS_DAY;
    const maxValue = (() => {
      if (!fullyBackfilled) return null;
      const { sum, count } = rangeSum(0, yesterday);
      return meanBrier(sum, count);
    })();

    // Persist the advanced accumulator (overwrite — this is authoritative state,
    // not a metric that benefits from mergeWithFallback).
    await saveSnapshot({
      category: ACCUMULATOR_CATEGORY,
      data: { data: { buckets, backfilledTo } as BrierAccumulator, timestamp: Date.now() },
      overwrite: true,
    });

    // While still backfilling, flag stale so the parent snapshot's mergeWithFallback
    // serves the last fully-computed value during the one-time catch-up after deploy.
    if (!fullyBackfilled) fetchErrors.push('omenstrat:brier:backfilling');

    return {
      value: {
        '7d': windowValue(7),
        '30d': windowValue(30),
        '90d': windowValue(90),
        max: maxValue,
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching Omenstrat Brier score:', error);
    // Don't persist a partial advance; return stale so the previous value is kept.
    fetchErrors.push('predict:gnosis:brier');
    return {
      value: emptyWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};
