import { STAKING_SUBGRAPHS_WITH_CLAIMED_TOTALS } from 'common-util/constants';
import { STAKING_SQUID_CLIENTS, TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { requestStaking } from 'common-util/graphql/indexer-requests';
import { checkSubgraphLag, getChainBlockNumber } from 'common-util/graphql/metric-utils';
import {
  META_FIELDS,
  mintedForStakingSets,
  SQUID_META_FIELDS,
  stakingChainSets,
  stakingChainSquidSets,
} from 'common-util/graphql/queries';
import { STAKING_CHAIN_KEYS, type StakingChain } from 'common-util/indexers';
import {
  CumulativePoint,
  EpochBoundary,
  PagedRow,
  TimestampedAmount,
  bucketByEpoch,
  cumulativeToEpochDeltas,
  pageSets,
  sumSeries,
} from './staking-emissions-math';

export type { EpochBoundary };

/**
 * The four staking series on the /olas-token emissions chart, as per-epoch deltas — the
 * chart sums them, like the dev and bond series. See docs/staking-emissions-chart.md.
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

export type SeriesErrors = {
  indexingErrors: string[];
  fetchErrors: string[];
  laggingSubgraphs: string[];
};

const MINTED_KEYS = ['stakingIncentivesClaimeds', 'stakingIncentivesBatchClaimeds'];
const CHAIN_KEYS = ['deposits', 'cumulativeDailyStakingGlobals'];

// Row shapes per key. `pageSets` returns untyped rows, so these keep the field names
// checked — reading `totalRewards` where `totalRewardsClaimed` was meant would
// otherwise compile and publish a well-formed wrong number.
type DepositRow = { amount: string; blockTimestamp: string };
type DailyRow = { timestamp: string; totalRewards: string; totalRewardsClaimed?: string };
type PayoutRow = { amount: string; blockTimestamp: string };
type SingleClaimRow = { transferAmount: string; blockTimestamp: string };
type BatchClaimRow = { totalTransferAmount: string; blockTimestamp: string };

type ChainSeries = {
  deposits: TimestampedAmount[];
  claimable: CumulativePoint[];
  claimed: CumulativePoint[];
};

const ZEROS = (length: number) => Array.from({ length }, () => BigInt(0));

/** Dispenser claims on Ethereum. `transferAmount` is what the treasury actually moved. */
const fetchMinted = async (epochs: EpochBoundary[], errors: SeriesErrors): Promise<bigint[]> => {
  try {
    const [{ rows, meta }, block] = await Promise.all([
      pageSets(TOKENOMICS_GRAPH_CLIENTS.ethereum, mintedForStakingSets, MINTED_KEYS, META_FIELDS),
      getChainBlockNumber('ethereum'),
    ]);

    if (meta?.hasIndexingErrors) errors.indexingErrors.push('staking-minted:ethereum');
    if (checkSubgraphLag(block, meta?.block?.number, 'ethereum')) {
      errors.laggingSubgraphs.push('staking-minted:ethereum');
    }

    return bucketByEpoch(
      [
        ...(rows.stakingIncentivesClaimeds as unknown as SingleClaimRow[]).map((claim) => ({
          blockTimestamp: claim.blockTimestamp,
          amount: BigInt(claim.transferAmount),
        })),
        ...(rows.stakingIncentivesBatchClaimeds as unknown as BatchClaimRow[]).map((claim) => ({
          blockTimestamp: claim.blockTimestamp,
          amount: BigInt(claim.totalTransferAmount),
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

/** Deposits, claimable and claimed from one staking chain, in one request. */
const fetchChain = async (
  chain: StakingChain,
  epochs: EpochBoundary[],
  errors: SeriesErrors,
  // Set on the retry below; not passed by callers
  forceFallback = false
): Promise<ChainSeries> => {
  const hasClaimedTotals =
    !forceFallback && (STAKING_SUBGRAPHS_WITH_CLAIMED_TOTALS as string[]).includes(chain);
  const empty: ChainSeries = { deposits: [], claimable: [], claimed: [] };
  // `pageSets` builds raw query text, so pick the dialect here; `requestStaking` hands
  // either back in the subgraph shape with `_meta`.
  const isSquid = chain in STAKING_SQUID_CLIENTS;
  const client = {
    request: (query: string) => requestStaking(chain, { subgraph: query, squid: query }),
  };

  try {
    const [{ rows, meta }, block] = await Promise.all([
      pageSets(
        client,
        (cursors) =>
          isSquid
            ? stakingChainSquidSets(cursors, hasClaimedTotals)
            : stakingChainSets(cursors, hasClaimedTotals),
        hasClaimedTotals ? CHAIN_KEYS : [...CHAIN_KEYS, 'rewardUpdates'],
        isSquid ? SQUID_META_FIELDS : META_FIELDS
      ),
      getChainBlockNumber(chain),
    ]);

    if (meta?.hasIndexingErrors) errors.indexingErrors.push(`staking-rewards:${chain}`);
    if (checkSubgraphLag(block, meta?.block?.number, chain)) {
      errors.laggingSubgraphs.push(`staking-rewards:${chain}`);
    }

    const daily = rows.cumulativeDailyStakingGlobals as unknown as DailyRow[];
    const claimable = daily.map((day) => ({
      timestamp: Number(day.timestamp),
      value: BigInt(day.totalRewards),
    }));

    let claimed: CumulativePoint[];
    if (hasClaimedTotals) {
      claimed = daily.map((day) => ({
        timestamp: Number(day.timestamp),
        value: BigInt(day.totalRewardsClaimed ?? '0'),
      }));
    } else {
      // Individual payouts, accumulated into the same cumulative shape
      let running = BigInt(0);
      claimed = ((rows.rewardUpdates || []) as unknown as PayoutRow[])
        .map((payout) => ({
          timestamp: Number(payout.blockTimestamp),
          amount: BigInt(payout.amount),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ timestamp, amount }) => {
          running += amount;
          return { timestamp, value: running };
        });
    }

    return {
      deposits: (rows.deposits as unknown as DepositRow[]).map((deposit) => ({
        blockTimestamp: deposit.blockTimestamp,
        amount: BigInt(deposit.amount),
      })),
      claimable,
      claimed,
    };
  } catch (error) {
    // Asking for a field a subgraph does not have fails the whole request, so a chain
    // listed here but served by an un-redeployed subgraph would take the entire metric
    // down — every chart frozen on the last snapshot — rather than losing one chain.
    // Retry once on the payout path, which every version of the subgraph can answer.
    if (hasClaimedTotals) {
      console.warn(`${chain} rejected the claimed accumulator, retrying on the payout path`);
      return fetchChain(chain, epochs, errors, true);
    }
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

  const [minted, chains] = await Promise.all([
    fetchMinted(epochs, errors),
    Promise.all(STAKING_CHAIN_KEYS.map((chain) => fetchChain(chain, epochs, errors))),
  ]);

  // Each chain's curve is differenced on its own before the chains are added
  const sumDeltas = (series: CumulativePoint[][]) =>
    sumSeries(
      series.map((points) => cumulativeToEpochDeltas(points, epochs)),
      epochs.length
    );

  // Summed as BigInt and stringified once here, since a snapshot cannot hold a bigint
  const asStrings = (values: bigint[]) => values.map(String);

  return {
    minted: asStrings(minted),
    dispensed: asStrings(bucketByEpoch(chains.flatMap((chain) => chain.deposits), epochs)),
    claimable: asStrings(sumDeltas(chains.map((chain) => chain.claimable))),
    claimed: asStrings(sumDeltas(chains.map((chain) => chain.claimed))),
  };
};
