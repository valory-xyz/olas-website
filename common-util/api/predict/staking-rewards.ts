import { PREDICT_STAKING_AGENT_IDS } from 'common-util/constants';
import { STAKING_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import {
  getStakingRewardsByTimeRangeQuery,
  stakingContractAgentIdsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { loadSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { WindowedMetric, WindowKey } from './omenstrat-brier';

const LIMIT = 1000;
const DAY = 86400;
const TRAIL_DAYS = 10;
const BACKFILL_CHUNK_DAYS = 30;

// UTC-midnight genesis days, mirroring roi-distribution.ts / omenstrat-brier.ts.
const OMEN_GENESIS_DAY = 1763769600;
// 2026-01-16 — first (internal-testing) on-chain activity; public launch was 2026-02-10.
const POLYMARKET_GENESIS_DAY = 1768521600;

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

type StakingContractAgentIdsResponse = {
  stakingContracts: { instance: string; agentIds: string[] }[];
};

// Predict staking contract addresses, resolved from each contract's staked agent ids —
// no hardcoded program list to maintain, and non-predict programs (LST, mech) drop out.
const fetchPredictContractAddresses = async (
  client: (typeof STAKING_GRAPH_CLIENTS)['gnosis'],
  chain: 'gnosis' | 'polygon'
): Promise<string[]> => {
  const response = (await client.request(
    stakingContractAgentIdsQuery
  )) as StakingContractAgentIdsResponse;
  const predictAgentIds = PREDICT_STAKING_AGENT_IDS[chain];
  const addresses = (response?.stakingContracts || [])
    .filter((contract) =>
      (contract.agentIds || []).some((id) => predictAgentIds.includes(Number(id)))
    )
    .map((contract) => contract.instance.toLowerCase());

  // The subgraph keeps every contract ever deployed, so an empty predict set can only be
  // a bad response — throw rather than bake zero-reward days into the accumulator.
  if (addresses.length === 0) {
    throw new Error(`No predict staking contracts (agent ids ${predictAgentIds}) on ${chain}`);
  }
  return addresses;
};

const dayOf = (ts: number): number => Math.floor(ts / DAY) * DAY;

// Sums rewardAmount per placement day for [startDay, endDay], cursor-paged by
// blockTimestamp. Mutates indexingErrors/laggingSubgraphs as a side effect.
const fetchDayBuckets = async (
  client: (typeof STAKING_GRAPH_CLIENTS)['gnosis'],
  contractAddresses: string[],
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
  genesisDay: number
): Promise<MetricWithStatus<WindowedMetric<string | null>>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];
  const source = `staking:${chain}`;

  const yesterday = getMidnightUtcTimestampDaysAgo(1);
  const client = STAKING_GRAPH_CLIENTS[chain];

  // A transient blob read failure must not restart the genesis backfill: bail with a
  // fetchError (mergeWithFallback holds the previous windows) and leave the blob untouched.
  const loaded = await loadSnapshot({ category });
  if (loaded.outcome === 'error') {
    console.error(`Could not read staking-rewards accumulator (${category}):`, loaded.error);
    fetchErrors.push(`${source}:accumulator-read`);
    return {
      value: emptyRewardWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
  const existing =
    loaded.outcome === 'found' ? (loaded.snapshot.data as unknown as RewardsAccumulator) : null;

  try {
    const [chainBlock, contractAddresses] = await Promise.all([
      getChainBlockNumber(chain),
      fetchPredictContractAddresses(client, chain),
    ]);

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

// Both chains sum only predict programs, resolved by staked agent id — the gnosis
// staking subgraph indexes every Olas program on the chain (LST included).
export const fetchOmenstratStakingRewards = (): Promise<StakingRewardsWindows> =>
  buildWindowedStakingRewards('predict-staking-rewards/omenstrat', 'gnosis', OMEN_GENESIS_DAY);

export const fetchPolystratStakingRewards = (): Promise<StakingRewardsWindows> =>
  buildWindowedStakingRewards(
    'predict-staking-rewards/polystrat',
    'polygon',
    POLYMARKET_GENESIS_DAY
  );
