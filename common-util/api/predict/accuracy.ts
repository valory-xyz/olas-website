import { polymarketAgentsGraphClient, predictAgentsGraphClient } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import {
  getOmenBetsByTimeRangeQuery,
  getPolymarketBetsByTimeRangeQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { emptyWindows, WindowedMetric } from './omenstrat-brier';

const LIMIT = 1000;
const DAY = 86400;
const INVALID_ANSWER_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// Days reprocessed at the head of the window every run. A bet only enters the
// query once its market settles (~4 days after placement), so re-fetching the
// trailing window picks up late settlements and overwrites those day buckets.
// Mirrors omenstrat-brier.ts. Bets settling later than TRAIL_DAYS aren't
// back-counted into their (already-backfilled) placement day — same tradeoff Brier
// accepts for late re-answers.
const TRAIL_DAYS = 10;
// One-time historical backfill step per run, walking from the head toward genesis.
const BACKFILL_CHUNK_DAYS = 30;

// UTC-midnight genesis days, mirroring OMEN_GENESIS_TS / POLYMARKET_GENESIS_TS in
// roi-distribution.ts (and OMEN_GENESIS_DAY in omenstrat-brier.ts). Backfill walks
// down to here, no further.
const OMEN_GENESIS_DAY = 1763769600;
const POLYMARKET_GENESIS_DAY = 1768867200;

// JSON-safe per-day bucket: settled bets and how many were correct.
type AccuracyBucket = { won: number; total: number };
type AccuracyAccumulator = {
  // dayTimestamp (UTC midnight, string) -> placement-day accuracy bucket, summed
  // across all trader agents. Contiguous over [backfilledTo, coveredTo].
  buckets: Record<string, AccuracyBucket>;
  // Oldest day processed so far. A window is "covered" once backfilledTo <= its cutoff.
  backfilledTo: number;
  // Newest day processed so far. Lets the head refresh bridge a cron-outage gap.
  coveredTo: number;
};

// Fetches settled bets for [startDay, endDay], buckets them by placement day, and
// returns won/total per day. Mutates indexingErrors/laggingSubgraphs as a side effect.
type FetchDayBuckets = (
  startDay: number,
  endDay: number,
  chainBlock: number | null,
  indexingErrors: string[],
  laggingSubgraphs: string[]
) => Promise<Map<number, AccuracyBucket>>;

// accuracy% = won / total * 100, or null when there's nothing settled in the range.
const rate = (won: number, total: number): number | null =>
  total === 0 ? null : (won / total) * 100;

const dayOf = (ts: number): number => Math.floor(ts / DAY) * DAY;

type OmenBetRow = {
  timestamp: string;
  outcomeIndex: number;
  fixedProductMarketMaker: { currentAnswer: string | null } | null;
};
type OmenBetsResponse = WithMeta<{ bets: OmenBetRow[] }>;

const fetchOmenDayBuckets: FetchDayBuckets = async (
  startDay,
  endDay,
  chainBlock,
  indexingErrors,
  laggingSubgraphs
) => {
  const perDay = new Map<number, AccuracyBucket>();
  if (startDay > endDay) return perDay;

  let cursor = endDay + DAY; // exclusive upper bound — covers all of endDay
  let metaChecked = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await predictAgentsGraphClient.request(
      getOmenBetsByTimeRangeQuery({ first: LIMIT, timestamp_gte: startDay, timestamp_lt: cursor })
    )) as OmenBetsResponse;

    if (!metaChecked) {
      if (response?._meta?.hasIndexingErrors) indexingErrors.push('predict:gnosis');
      if (chainBlock && checkSubgraphLag(chainBlock, response?._meta?.block?.number, 'gnosis')) {
        laggingSubgraphs.push('predict:gnosis');
      }
      metaChecked = true;
    }

    const rows = response?.bets || [];
    if (rows.length === 0) break;

    let minTs = cursor;
    for (const bet of rows) {
      const ts = Number(bet.timestamp);
      if (ts < minTs) minTs = ts;
      const answer = bet.fixedProductMarketMaker?.currentAnswer;
      if (!answer || answer === INVALID_ANSWER_HEX) continue;
      const day = dayOf(ts);
      const cur = perDay.get(day) || { won: 0, total: 0 };
      cur.total += 1;
      if (Number(answer) === Number(bet.outcomeIndex)) cur.won += 1;
      perDay.set(day, cur);
    }

    if (rows.length < LIMIT) break;
    cursor = minTs; // next page strictly older
  }
  return perDay;
};

type PolyBetRow = {
  blockTimestamp: string;
  outcomeIndex: number;
  question: { resolution: { winningIndex: number } | null } | null;
};
type PolyBetsResponse = WithMeta<{ bets: PolyBetRow[] }>;

const fetchPolyDayBuckets: FetchDayBuckets = async (
  startDay,
  endDay,
  chainBlock,
  indexingErrors,
  laggingSubgraphs
) => {
  const perDay = new Map<number, AccuracyBucket>();
  if (startDay > endDay) return perDay;

  let cursor = endDay + DAY;
  let metaChecked = false;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await polymarketAgentsGraphClient.request(
      getPolymarketBetsByTimeRangeQuery({
        first: LIMIT,
        blockTimestamp_gte: startDay,
        blockTimestamp_lt: cursor,
      })
    )) as PolyBetsResponse;

    if (!metaChecked) {
      if (response?._meta?.hasIndexingErrors) indexingErrors.push('predict:polygon');
      if (chainBlock && checkSubgraphLag(chainBlock, response?._meta?.block?.number, 'polygon')) {
        laggingSubgraphs.push('predict:polygon');
      }
      metaChecked = true;
    }

    const rows = response?.bets || [];
    if (rows.length === 0) break;

    let minTs = cursor;
    for (const bet of rows) {
      const ts = Number(bet.blockTimestamp);
      if (ts < minTs) minTs = ts;
      // No server-side resolution filter — skip unresolved bets (counted later once
      // their market resolves and the trailing window reprocesses the day).
      const winningIndex = bet.question?.resolution?.winningIndex;
      if (winningIndex == null || winningIndex < 0) continue;
      const day = dayOf(ts);
      const cur = perDay.get(day) || { won: 0, total: 0 };
      cur.total += 1;
      if (Number(bet.outcomeIndex) === Number(winningIndex)) cur.won += 1;
      perDay.set(day, cur);
    }

    if (rows.length < LIMIT) break;
    cursor = minTs;
  }
  return perDay;
};

// Self-contained incremental accumulator persisted in its own blob, advanced a
// little each hourly predict refresh instead of rescanning all bet history.
// Structurally identical to fetchOmenstratBrier (see omenstrat-brier.ts) — only the
// per-day math (won/total instead of brierSum/brierCount) differs.
const buildWindowedAccuracy = async (
  category: string,
  chain: 'gnosis' | 'polygon',
  genesisDay: number,
  source: string,
  fetchDayBuckets: FetchDayBuckets
): Promise<MetricWithStatus<WindowedMetric<number | null>>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  // Only complete days are counted; today is excluded so windows mean "last N full days".
  const yesterday = getMidnightUtcTimestampDaysAgo(1);

  let existing: AccuracyAccumulator | null = null;
  try {
    const snapshot = await getSnapshot({ category });
    existing = (snapshot?.data as unknown as AccuracyAccumulator) ?? null;
  } catch (e) {
    console.warn(`Could not load accuracy accumulator (${category}); rebuilding from scratch`, e);
  }

  try {
    const chainBlock = await getChainBlockNumber(chain);

    const buckets: Record<string, AccuracyBucket> = { ...(existing?.buckets ?? {}) };
    let backfilledTo = existing?.backfilledTo ?? yesterday + DAY;
    const prevCoveredTo = existing?.coveredTo ?? yesterday;

    const applyBuckets = (perDay: Map<number, AccuracyBucket>) => {
      for (const [day, bucket] of perDay.entries()) buckets[String(day)] = bucket;
    };

    // 1. Head refresh up to yesterday (trailing window, widened to bridge any gap).
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

    const rangeSum = (fromDay: number, toDay: number) => {
      let won = 0;
      let total = 0;
      for (const [k, v] of Object.entries(buckets)) {
        const day = Number(k);
        if (day >= fromDay && day <= toDay) {
          won += v.won;
          total += v.total;
        }
      }
      return { won, total };
    };

    // A window is only published once its full range is covered; otherwise null
    // (so mergeWithFallback keeps the previous value rather than an understated one).
    const windowValue = (days: number): number | null => {
      const cutoff = yesterday - (days - 1) * DAY;
      if (backfilledTo > cutoff) return null;
      const { won, total } = rangeSum(cutoff, yesterday);
      return rate(won, total);
    };

    const fullyBackfilled = backfilledTo <= genesisDay;
    const maxValue = (() => {
      if (!fullyBackfilled) return null;
      const { won, total } = rangeSum(0, yesterday);
      return rate(won, total);
    })();

    // Persist the advanced accumulator (overwrite — authoritative state).
    await saveSnapshot({
      category,
      data: {
        data: { buckets, backfilledTo, coveredTo: yesterday } as AccuracyAccumulator,
        timestamp: Date.now(),
      },
      overwrite: true,
    });

    // While still backfilling, flag stale so the parent snapshot's mergeWithFallback
    // serves the last fully-computed value during the one-time catch-up after deploy.
    if (!fullyBackfilled) fetchErrors.push(`${source}:accuracy:backfilling`);

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
    console.error(`Error fetching prediction accuracy (${category}):`, error);
    // Don't persist a partial advance; return stale so the previous value is kept.
    fetchErrors.push(`${source}:accuracy`);
    return {
      value: emptyWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};

export const fetchOmenstratAccuracy = (): Promise<
  MetricWithStatus<WindowedMetric<number | null>>
> =>
  buildWindowedAccuracy(
    'predict-accuracy/omenstrat',
    'gnosis',
    OMEN_GENESIS_DAY,
    'omenstrat',
    fetchOmenDayBuckets
  );

export const fetchPolystratAccuracy = (): Promise<
  MetricWithStatus<WindowedMetric<number | null>>
> =>
  buildWindowedAccuracy(
    'predict-accuracy/polystrat',
    'polygon',
    POLYMARKET_GENESIS_DAY,
    'polystrat',
    fetchPolyDayBuckets
  );
