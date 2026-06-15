import { PREDICT_STAKING_PROGRAMS_PEARL } from 'common-util/constants';
import { STAKING_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import { getStakingRewardsByTimeRangeQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { WindowedMetric, WindowKey } from './omenstrat-brier';

const LIMIT = 1000;
const DAY = 86400;
const TRAIL_DAYS = 10;
const BACKFILL_CHUNK_DAYS = 30;

// UTC-midnight genesis days, mirroring roi-distribution.ts / omenstrat-brier.ts.
const OMEN_GENESIS_DAY = 1763769600;
const POLYMARKET_GENESIS_DAY = 1768867200;

// dayTimestamp (UTC midnight, string) -> summed rewardAmount that day (1e18 OLAS,
// stored as a decimal string so the BigInt survives JSON).
type RewardsAccumulator = {
  buckets: Record<string, string>;
  backfilledTo: number;
  coveredTo: number;
};

// nulls for every window — used as the safe default on a hard error.
const emptyRewardWindows = (): WindowedMetric<string | null> => ({
  '7d': null,
  '30d': null,
  '90d': null,
  max: null,
});

type RewardRow = { rewardAmount: string; blockTimestamp: string };
type RewardsResponse = WithMeta<{ serviceRewardsHistories: RewardRow[] }>;

const dayOf = (ts: number): number => Math.floor(ts / DAY) * DAY;

// Sums rewardAmount per placement day for [startDay, endDay], cursor-paged by
// blockTimestamp. Mutates indexingErrors/laggingSubgraphs as a side effect.
const fetchDayBuckets = async (
  client: (typeof STAKING_GRAPH_CLIENTS)['gnosis'],
  contractAddresses: string[] | undefined,
  chain: 'gnosis' | 'polygon',
  startDay: number,
  endDay: number,
  chainBlock: number | null,
  indexingErrors: string[],
  laggingSubgraphs: string[]
): Promise<Map<number, bigint>> => {
  const perDay = new Map<number, bigint>();
  if (startDay > endDay) return perDay;

  let cursor = endDay + DAY; // exclusive upper bound — covers all of endDay
  let metaChecked = false;
  const source = `staking:${chain}`;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = (await client.request(
      getStakingRewardsByTimeRangeQuery({
        first: LIMIT,
        contractAddresses,
        timestamp_gte: startDay,
        timestamp_lt: cursor,
      })
    )) as RewardsResponse;

    if (!metaChecked) {
      if (response?._meta?.hasIndexingErrors) indexingErrors.push(source);
      if (chainBlock && checkSubgraphLag(chainBlock, response?._meta?.block?.number, chain)) {
        laggingSubgraphs.push(source);
      }
      metaChecked = true;
    }

    const rows = response?.serviceRewardsHistories || [];
    if (rows.length === 0) break;

    let minTs = cursor;
    for (const row of rows) {
      const ts = Number(row.blockTimestamp);
      if (ts < minTs) minTs = ts;
      const day = dayOf(ts);
      perDay.set(day, (perDay.get(day) ?? 0n) + BigInt(row.rewardAmount || 0));
    }

    if (rows.length < LIMIT) break;
    // Cursor by `blockTimestamp_lt: minTs`. If a full page ends exactly on a
    // timestamp shared by more rows, those siblings are dropped — a rare,
    // undercount-only edge given second-granularity reward checkpoints. Accepted
    // here (rewards feed final ROI, not a hard total); revisit with id_gt paging
    // within a timestamp if reward events ever cluster on identical seconds.
    cursor = minTs;
  }
  return perDay;
};

// Self-contained incremental accumulator persisted in its own blob (advanced each
// hourly predict refresh). Structurally identical to fetchOmenstratBrier — only the
// per-day math (summed rewardAmount instead of brierSum/brierCount) differs. Returns
// the summed OLAS rewards (1e18, decimal string) per window; null windows are not yet
// covered (still backfilling) so the windowed-ROI combiner can omit the staking term.
const buildWindowedStakingRewards = async (
  category: string,
  chain: 'gnosis' | 'polygon',
  genesisDay: number,
  contractAddresses: string[] | undefined
): Promise<MetricWithStatus<WindowedMetric<string | null>>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];
  const source = `staking:${chain}`;

  const yesterday = getMidnightUtcTimestampDaysAgo(1);
  const client = STAKING_GRAPH_CLIENTS[chain];

  let existing: RewardsAccumulator | null = null;
  try {
    const snapshot = await getSnapshot({ category });
    existing = (snapshot?.data as unknown as RewardsAccumulator) ?? null;
  } catch (e) {
    console.warn(`Could not load staking-rewards accumulator (${category}); rebuilding`, e);
  }

  try {
    const chainBlock = await getChainBlockNumber(chain);

    const buckets: Record<string, string> = { ...(existing?.buckets ?? {}) };
    let backfilledTo = existing?.backfilledTo ?? yesterday + DAY;
    const prevCoveredTo = existing?.coveredTo ?? yesterday;

    const applyBuckets = (perDay: Map<number, bigint>) => {
      for (const [day, sum] of perDay.entries()) buckets[String(day)] = sum.toString();
    };

    const trailStart = yesterday - (TRAIL_DAYS - 1) * DAY;
    const headStart = Math.max(
      genesisDay,
      Math.min(trailStart, prevCoveredTo - (TRAIL_DAYS - 1) * DAY)
    );
    applyBuckets(
      await fetchDayBuckets(
        client,
        contractAddresses,
        chain,
        headStart,
        yesterday,
        chainBlock,
        indexingErrors,
        laggingSubgraphs
      )
    );
    backfilledTo = Math.min(backfilledTo, headStart);

    if (backfilledTo > genesisDay) {
      const hi = backfilledTo - DAY;
      const lo = Math.max(genesisDay, backfilledTo - BACKFILL_CHUNK_DAYS * DAY);
      applyBuckets(
        await fetchDayBuckets(
          client,
          contractAddresses,
          chain,
          lo,
          hi,
          chainBlock,
          indexingErrors,
          laggingSubgraphs
        )
      );
      backfilledTo = lo;
    }

    const rangeSum = (fromDay: number, toDay: number): bigint => {
      let sum = 0n;
      for (const [k, v] of Object.entries(buckets)) {
        const day = Number(k);
        if (day >= fromDay && day <= toDay) sum += BigInt(v);
      }
      return sum;
    };

    // A window is only published once its full range is covered; otherwise null.
    const windowValue = (days: number): string | null => {
      const cutoff = yesterday - (days - 1) * DAY;
      if (backfilledTo > cutoff) return null;
      return rangeSum(cutoff, yesterday).toString();
    };

    const fullyBackfilled = backfilledTo <= genesisDay;
    const maxValue = fullyBackfilled ? rangeSum(0, yesterday).toString() : null;

    await saveSnapshot({
      category,
      data: {
        data: { buckets, backfilledTo, coveredTo: yesterday } as RewardsAccumulator,
        timestamp: Date.now(),
      },
      overwrite: true,
    });

    if (!fullyBackfilled) fetchErrors.push(`${source}:rewards:backfilling`);

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
    console.error(`Error fetching staking rewards (${category}):`, error);
    fetchErrors.push(`${source}:rewards`);
    return {
      value: emptyRewardWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};

export type StakingRewardsWindows = MetricWithStatus<WindowedMetric<string | null>>;
export type { WindowKey };

// Omenstrat: filter to the predict (Pearl) staking programs only. The gnosis staking
// subgraph indexes every Olas program on the chain — including LST — so we scope to
// PREDICT_STAKING_PROGRAMS_PEARL (the Pearl-configured predict programs) rather than
// the broader GNOSIS_STAKING_CONTRACTS list, which still mixes in non-predict programs
// and would otherwise inflate predict final ROI.
export const fetchOmenstratStakingRewards = (): Promise<StakingRewardsWindows> =>
  buildWindowedStakingRewards(
    'predict-staking-rewards/omenstrat',
    'gnosis',
    OMEN_GENESIS_DAY,
    Object.values(PREDICT_STAKING_PROGRAMS_PEARL)
  );

// Polystrat: the polygon staking subgraph is predict-only, so sum unfiltered.
export const fetchPolystratStakingRewards = (): Promise<StakingRewardsWindows> =>
  buildWindowedStakingRewards(
    'predict-staking-rewards/polystrat',
    'polygon',
    POLYMARKET_GENESIS_DAY,
    undefined
  );
