import { STAKING_SUBGRAPHS_WITH_CLAIMED_TOTALS } from 'common-util/constants';
import { STAKING_GRAPH_CLIENTS, TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { checkSubgraphLag, getChainBlockNumber } from 'common-util/graphql/metric-utils';
import { META_FIELDS, mintedForStakingSets, stakingChainSets } from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';

/**
 * The four staking series on the /olas-token emissions chart. Each is cumulative in the
 * chart, so this returns the per-epoch delta and the component runs the sum, matching
 * how the dev and bond series already work.
 *
 * See docs/staking-emissions-chart.md for what each line means and why two of them
 * differ.
 */
export type StakingEmissionsSeries = {
  // OLAS that left the minter for staking, per Dispenser claim on Ethereum
  minted: string[];
  // OLAS that arrived in staking contracts, per Deposit across staking chains
  dispensed: string[];
  // rewards services earned, accrued at checkpoint
  claimable: string[];
  // rewards actually paid out to stakers
  claimed: string[];
};

export type EpochBoundary = { counter: number; blockTimestamp: string };

type TimestampedAmount = { blockTimestamp: string; amount: bigint };

type DailyTotal = { timestamp: string; totalRewards: string; totalRewardsClaimed?: string };

type DepositsResult = WithMeta<{
  deposits: { id: string; amount: string; blockTimestamp: string }[];
}>;
type DailyResult = WithMeta<{ cumulativeDailyStakingGlobals: (DailyTotal & { id: string })[] }>;
type ClaimedResult = WithMeta<{
  rewardUpdates: { id: string; amount: string; blockTimestamp: string }[];
}>;
type IncentivesResult = WithMeta<{
  stakingIncentivesClaimeds: { blockTimestamp: string; transferAmount: string }[];
  stakingIncentivesBatchClaimeds: { blockTimestamp: string; totalTransferAmount: string }[];
}>;

const PAGE_SIZE = 1000;

const MINTED_KEYS = ['stakingIncentivesClaimeds', 'stakingIncentivesBatchClaimeds'];
const CHAIN_KEYS = ['deposits', 'cumulativeDailyStakingGlobals'];

type StakingChain = keyof typeof STAKING_GRAPH_CLIENTS;
type CumulativePoint = { timestamp: number; value: bigint };
type ChainSeries = {
  deposits: TimestampedAmount[];
  claimable: CumulativePoint[];
  claimed: CumulativePoint[];
};
export type SeriesErrors = {
  indexingErrors: string[];
  fetchErrors: string[];
  laggingSubgraphs: string[];
};

/**
 * Mode cannot be reindexed — it runs on a non-archive RPC — so it will never carry
 * `totalRewardsClaimed` and must always take the slow path. Excluding it from the type
 * makes adding it a compile error rather than a runtime one: asking a subgraph for a
 * field it does not have fails the whole request, not just that field.
 */
const usesClaimedTotals = (chain: string) =>
  chain !== 'mode' && (STAKING_SUBGRAPHS_WITH_CLAIMED_TOTALS as readonly string[]).includes(chain);

const ZEROS = (length: number) => Array.from({ length }, () => '0');

/**
 * Epoch `i` covers `(epochs[i - 1].blockTimestamp, epochs[i].blockTimestamp]`, the same
 * windows the dev and bond series use. The final epoch is still open, so it has no
 * upper bound and collects everything since the previous one.
 */
const epochIndexFor = (timestamp: number, epochs: EpochBoundary[]): number => {
  for (let i = 0; i < epochs.length; i += 1) {
    const isLast = i === epochs.length - 1;
    const lower = i === 0 ? -Infinity : Number(epochs[i - 1].blockTimestamp);
    const upper = isLast ? Infinity : Number(epochs[i].blockTimestamp);
    if (timestamp > lower && timestamp <= upper) return i;
  }
  return -1;
};

const bucketByEpoch = (events: TimestampedAmount[], epochs: EpochBoundary[]): string[] => {
  const totals = epochs.map(() => BigInt(0));
  events.forEach(({ blockTimestamp, amount }) => {
    const index = epochIndexFor(Number(blockTimestamp), epochs);
    if (index >= 0) totals[index] += amount;
  });
  return totals.map(String);
};

/**
 * Turn a cumulative daily series into per-epoch deltas: read the running total as it
 * stood at each epoch's end, then difference consecutive epochs. Days without activity
 * have no snapshot, so this carries the last one forward rather than reading a gap as
 * zero.
 */
const cumulativeToEpochDeltas = (
  daily: { timestamp: number; value: bigint }[],
  epochs: EpochBoundary[]
): string[] => {
  const sorted = [...daily].sort((a, b) => a.timestamp - b.timestamp);
  const totalsAtEpochEnd = epochs.map((epoch, i) => {
    const cutoff = i === epochs.length - 1 ? Infinity : Number(epoch.blockTimestamp);
    let running = BigInt(0);
    for (const point of sorted) {
      if (point.timestamp > cutoff) break;
      running = point.value;
    }
    return running;
  });

  return totalsAtEpochEnd.map((total, i) =>
    String(i === 0 ? total : total - totalsAtEpochEnd[i - 1])
  );
};

type PagedRow = { id: string } & Record<string, unknown>;

type GraphClient = { request: (query: string) => Promise<unknown> };

/**
 * Asks one subgraph for several cursor-paged sets in a single request, then keeps
 * requesting only the sets that came back full until every one is exhausted.
 *
 * One round trip covers the common case, where nothing has outgrown a page, without
 * giving up the paging that keeps a set correct once something does.
 */
const pageSets = async (
  client: GraphClient,
  buildSets: (cursors: Record<string, string>) => string[],
  keys: string[]
): Promise<{ rows: Record<string, PagedRow[]>; meta: WithMeta<unknown>['_meta'] }> => {
  const cursors: Record<string, string> = Object.fromEntries(keys.map((key) => [key, '']));
  const rows: Record<string, PagedRow[]> = Object.fromEntries(keys.map((key) => [key, []]));
  const pending = new Set(keys);
  let meta: WithMeta<unknown>['_meta'];

  while (pending.size > 0) {
    // Ask only for what is still incomplete, so an exhausted set is not re-fetched
    const requested = keys.filter((key) => pending.has(key));
    const sets = buildSets(cursors).filter((_, index) => pending.has(keys[index]));
    const data = (await client.request(`{ ${META_FIELDS} ${sets.join('\n')} }`)) as WithMeta<
      Record<string, PagedRow[]>
    >;
    meta = data._meta;

    requested.forEach((key) => {
      const page = data[key] || [];
      rows[key].push(...page);
      if (page.length < PAGE_SIZE) {
        pending.delete(key);
      } else {
        cursors[key] = page[page.length - 1].id;
      }
    });
  }

  return { rows, meta };
};

/**
 * OLAS minted for staking, from the two Dispenser claim events on Ethereum, in one
 * request. `transferAmount` is what the treasury actually moved.
 */
const fetchMinted = async (epochs: EpochBoundary[], errors: SeriesErrors): Promise<string[]> => {
  try {
    const [{ rows, meta }, block] = await Promise.all([
      pageSets(TOKENOMICS_GRAPH_CLIENTS.ethereum, mintedForStakingSets, MINTED_KEYS),
      getChainBlockNumber('ethereum'),
    ]);

    if (meta?.hasIndexingErrors) errors.indexingErrors.push('staking-minted:ethereum');
    if (checkSubgraphLag(block, meta?.block?.number, 'ethereum')) {
      errors.laggingSubgraphs.push('staking-minted:ethereum');
    }

    return bucketByEpoch(
      [
        ...rows.stakingIncentivesClaimeds.map((claim) => ({
          blockTimestamp: String(claim.blockTimestamp),
          amount: BigInt(String(claim.transferAmount)),
        })),
        ...rows.stakingIncentivesBatchClaimeds.map((claim) => ({
          blockTimestamp: String(claim.blockTimestamp),
          amount: BigInt(String(claim.totalTransferAmount)),
        })),
      ],
      epochs
    );
  } catch (error) {
    console.error('Error fetching OLAS minted for staking:', error);
    errors.fetchErrors.push('staking-minted:ethereum');
    return ZEROS(epochs.length);
  }
};

/**
 * Everything the chart needs from one staking chain, in one request: deposits, the
 * daily claimable total, and claimed — from the daily accumulator where the subgraph
 * has it, and otherwise from the individual payouts.
 */
const fetchChain = async (
  chain: string,
  client: GraphClient,
  epochs: EpochBoundary[],
  errors: SeriesErrors
): Promise<ChainSeries> => {
  const hasClaimedTotals = usesClaimedTotals(chain);
  const empty: ChainSeries = { deposits: [], claimable: [], claimed: [] };

  try {
    const [{ rows, meta }, block] = await Promise.all([
      pageSets(
        client,
        (cursors) => stakingChainSets(cursors, hasClaimedTotals),
        hasClaimedTotals ? CHAIN_KEYS : [...CHAIN_KEYS, 'rewardUpdates']
      ),
      getChainBlockNumber(chain),
    ]);

    if (meta?.hasIndexingErrors) errors.indexingErrors.push(`staking-rewards:${chain}`);
    if (checkSubgraphLag(block, meta?.block?.number, chain)) {
      errors.laggingSubgraphs.push(`staking-rewards:${chain}`);
    }

    const daily = rows.cumulativeDailyStakingGlobals;
    const claimable = daily.map((day) => ({
      timestamp: Number(day.timestamp),
      value: BigInt(String(day.totalRewards)),
    }));

    let claimed: CumulativePoint[];
    if (hasClaimedTotals) {
      claimed = daily.map((day) => ({
        timestamp: Number(day.timestamp),
        value: BigInt(String(day.totalRewardsClaimed ?? '0')),
      }));
    } else {
      // Individual payouts, accumulated into the same cumulative shape
      let running = BigInt(0);
      claimed = (rows.rewardUpdates || [])
        .map((payout) => ({
          timestamp: Number(payout.blockTimestamp),
          amount: BigInt(String(payout.amount)),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ timestamp, amount }) => {
          running += amount;
          return { timestamp, value: running };
        });
    }

    return {
      deposits: rows.deposits.map((deposit) => ({
        blockTimestamp: String(deposit.blockTimestamp),
        amount: BigInt(String(deposit.amount)),
      })),
      claimable,
      claimed,
    };
  } catch (error) {
    console.error(`Error fetching staking emissions from ${chain}:`, error);
    errors.fetchErrors.push(`staking-rewards:${chain}`);
    return empty;
  }
};

export const fetchStakingEmissionsSeries = async (
  epochs: EpochBoundary[],
  errors: SeriesErrors
): Promise<StakingEmissionsSeries> => {
  if (epochs.length === 0) {
    return { minted: [], dispensed: [], claimable: [], claimed: [] };
  }

  // Ethereum carries the minted line; every staking chain answers the other three in a
  // single request each. All of them run concurrently.
  const [minted, chains] = await Promise.all([
    fetchMinted(epochs, errors),
    Promise.all(
      Object.entries(STAKING_GRAPH_CLIENTS).map(([chain, client]) =>
        fetchChain(chain, client as GraphClient, epochs, errors)
      )
    ),
  ]);

  // Each chain has its own cumulative curve, so each is differenced into per-epoch
  // deltas on its own before the chains are added: a chain with no snapshot for a day
  // has not gone to zero.
  const sumDeltas = (series: CumulativePoint[][]) =>
    series
      .map((points) => cumulativeToEpochDeltas(points, epochs))
      .reduce(
        (totals, deltas) => totals.map((total, i) => String(BigInt(total) + BigInt(deltas[i]))),
        ZEROS(epochs.length)
      );

  return {
    minted,
    dispensed: bucketByEpoch(
      chains.flatMap((chain) => chain.deposits),
      epochs
    ),
    claimable: sumDeltas(chains.map((chain) => chain.claimable)),
    claimed: sumDeltas(chains.map((chain) => chain.claimed)),
  };
};
