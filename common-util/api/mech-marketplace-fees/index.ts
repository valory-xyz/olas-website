import { readChainlinkUsdPrice } from 'common-util/chainlink';
import {
  CHAINLINK_PRICE_FEED_ADDRESS_BASE_ETH_USD,
  CHAINLINK_PRICE_FEED_ADDRESS_OPTIMISM_ETH_USD,
  CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD,
} from 'common-util/constants';
import { MechFeesChain, requestMechFees } from 'common-util/graphql/indexers';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  mechFeesDrainTotalsQuery,
  mechFeesDrainTotalsSquidQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus } from 'common-util/graphql/types';
import { getSnapshot } from 'common-util/snapshot-storage';
import { getChainReader } from 'common-util/web3';
import { Abi } from 'viem';
import type { MainMetricsData } from 'common-util/api/main-metrics';
import {
  DrainTotalsRow,
  DrainedTotals,
  findDecreasedToken,
  isSaneFeesUsd,
  toDrainedByModel,
  trackerFees,
} from './math';

/**
 * Mech Marketplace "fees collected".
 *
 * The marketplace takes a 15% fee on agent-to-agent payments. Each per-token
 * `BalanceTracker` adds it to `collectedFees` when a mech processes its payout; `drain()`
 * sends that balance to the drainer (non-OLAS → Olas Treasury, OLAS → burned) and resets
 * it to 0.
 *
 * Lifetime fees = live `collectedFees()` per tracker (on-chain, not yet drained) + the
 * tracker's cumulative drained amount (new-mech-fees subgraph `DrainTotals`, or the
 * mech-fees squid on Robinhood; USD-priced at drain time).
 *
 * Counted: USDC trackers, Robinhood USDG and Gnosis xDAI (1 USD), plus ETH on
 * Base/Optimism and POL on Polygon priced via Chainlink. Not counted: ETH on
 * Ethereum/Arbitrum/Robinhood, CELO, NVM credits and all OLAS trackers (OLAS fees are
 * burned — see `olasBurned` in agent-economies/mech-fees.ts). Robinhood ETH is out because
 * its ETH/USD feed routinely goes over an hour between rounds, past
 * `CHAINLINK_MAX_ANSWER_AGE_SEC`.
 *
 * Guards before publishing: the USD total must pass `isSaneFeesUsd`, and no token's
 * lifetime amount may be below the previous `main` snapshot (`findDecreasedToken`). A
 * subgraph that answers with no `DrainTotals` rows mid-reindex, or a drain the subgraph
 * has not indexed yet, would otherwise publish a lower number as healthy. On either breach
 * the value is null with a fetch error, so `mergeWithFallback` keeps the last good value.
 */

type FeeTrackerChain = MechFeesChain;

// `DrainTotals` id in the subgraph.
type DrainModel = 'native' | 'token-usdc' | 'token-olas' | 'nvm';

type FeeTracker = {
  chain: FeeTrackerChain;
  address: `0x${string}`;
  decimals: number;
  token: 'xDAI' | 'USDC' | 'USDG' | 'ETH' | 'POL';
  model: DrainModel;
  // Chainlink <token>/USD feed; absent means 1 token = 1 USD.
  priceFeed?: `0x${string}`;
};

// Addresses from the new-mech-fees subgraph manifests (subgraph.<chain>.yaml) and the
// mech-fees squid's `CHAINS` table (Robinhood).
export const MARKETPLACE_FEE_TRACKERS: FeeTracker[] = [
  {
    chain: 'gnosis',
    address: '0x21cE6799A22A3Da84B7c44a814a9c79ab1d2A50D',
    decimals: 18,
    token: 'xDAI',
    model: 'native',
  },
  {
    chain: 'ethereum',
    address: '0x897aee2e6F3d37740D334C55Caea2e0caC82aa14',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'arbitrum',
    address: '0xa987Fe40034AaD2EbB0E01B22DFc57f20C87F949',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'celo',
    address: '0xA749f605D93B3efcc207C54270d83C6E8fa70fF8',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'optimism',
    address: '0xA123748Ce7609F507060F947b70298D0bde621E6',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'polygon',
    address: '0x5C50ebc17d002A4484585C8fbf62f51953493c0B',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'base',
    address: '0x0443C55e151dBA13fae079518F9dd01ff9c21CB2',
    decimals: 6,
    token: 'USDC',
    model: 'token-usdc',
  },
  {
    chain: 'base',
    address: '0xB3921F8D8215603f0Bd521341Ac45eA8f2d274c1',
    decimals: 18,
    token: 'ETH',
    model: 'native',
    priceFeed: CHAINLINK_PRICE_FEED_ADDRESS_BASE_ETH_USD,
  },
  {
    chain: 'optimism',
    address: '0x4Cd816ce806FF1003ee459158A093F02AbF042a8',
    decimals: 18,
    token: 'ETH',
    model: 'native',
    priceFeed: CHAINLINK_PRICE_FEED_ADDRESS_OPTIMISM_ETH_USD,
  },
  {
    chain: 'polygon',
    // Same address as the Olas Tokenomics proxy on Ethereum (same deployer nonce on both
    // chains); on Polygon it is the native BalanceTracker.
    address: '0xc096362fa6f4A4B1a9ea68b1043416f3381ce300',
    decimals: 18,
    token: 'POL',
    model: 'native',
    priceFeed: CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD,
  },
  {
    chain: 'robinhood',
    // The `token-usdc` model on Robinhood holds USDG, the chain's 6-decimal stablecoin.
    address: '0xEB5638eefE289691EcE01943f768EDBF96258a80',
    decimals: 6,
    token: 'USDG',
    model: 'token-usdc',
  },
];

const COLLECTED_FEES_ABI = [
  {
    name: 'collectedFees',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const satisfies Abi;

type UndrainedRead = { collected: bigint; priceUsd: number };

// Throws on any failure so the caller records a fetch error for this tracker.
const readUndrained = async (tracker: FeeTracker): Promise<UndrainedRead> => {
  const read = getChainReader(tracker.chain);
  if (!read) throw new Error(`Missing RPC for ${tracker.chain}`);

  const [collected, priceUsd] = await Promise.all([
    read({
      address: tracker.address,
      abi: COLLECTED_FEES_ABI as unknown as Abi,
      functionName: 'collectedFees',
    }) as Promise<bigint>,
    tracker.priceFeed ? readChainlinkUsdPrice(tracker.chain, tracker.priceFeed) : 1,
  ]);
  return { collected, priceUsd };
};

type DrainTotalsResult = { drainTotals_collection: DrainTotalsRow[] };

// Token symbol → lifetime amount in that token (un-drained + drained).
export type MechFeesByToken = Record<string, number>;

export type MechMarketplaceFees = {
  feesCollected: MetricWithStatus<string | null>;
  feesCollectedByToken: MetricWithStatus<MechFeesByToken | null>;
};

const previousFeesByToken = async (): Promise<MechFeesByToken | null> => {
  const snapshot = await getSnapshot({ category: 'main' });
  return (snapshot?.data as MainMetricsData | undefined)?.feesCollectedByToken?.value ?? null;
};

/**
 * Lifetime protocol fees in USD across `MARKETPLACE_FEE_TRACKERS`, plus the per-token
 * breakdown. Both share one status. Used by the `main` snapshot (homepage) and the
 * `agent-economies` snapshot (mech page).
 */
export const fetchMechMarketplaceFees = async (): Promise<MechMarketplaceFees> => {
  const fetchErrors: string[] = [];
  const indexingErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  const chains = Array.from(new Set(MARKETPLACE_FEE_TRACKERS.map((t) => t.chain)));

  const [undrainedResults, drainResults, blockResults, previous] = await Promise.all([
    Promise.allSettled(MARKETPLACE_FEE_TRACKERS.map(readUndrained)),
    Promise.allSettled(
      chains.map((chain) =>
        requestMechFees<DrainTotalsResult>(chain, {
          subgraph: mechFeesDrainTotalsQuery,
          squid: mechFeesDrainTotalsSquidQuery,
        })
      )
    ),
    Promise.allSettled(chains.map((chain) => getChainBlockNumber(chain))),
    previousFeesByToken().catch(() => null),
  ]);

  // A failed subgraph query is a fetch error: its chain's drained share would otherwise
  // silently count as 0.
  const drainedByChain: Partial<Record<FeeTrackerChain, Record<string, DrainedTotals>>> = {};
  chains.forEach((chain, i) => {
    const res = drainResults[i];
    if (res.status === 'rejected') {
      console.error(`drainTotals:${chain}`, res.reason);
      fetchErrors.push(`drainTotals:${chain}`);
      return;
    }
    if (res.value?._meta?.hasIndexingErrors) indexingErrors.push(`drainTotals:${chain}`);
    const latestBlock = blockResults[i].status === 'fulfilled' ? blockResults[i].value : null;
    if (checkSubgraphLag(latestBlock, res.value?._meta?.block?.number, chain)) {
      laggingSubgraphs.push(`drainTotals:${chain}`);
    }
    drainedByChain[chain] = toDrainedByModel(res.value?.drainTotals_collection);
  });

  let totalUsd = 0;
  const byToken: MechFeesByToken = {};
  let undrainedFailures = 0;
  MARKETPLACE_FEE_TRACKERS.forEach((tracker, i) => {
    const { chain, token, model, decimals } = tracker;
    const undrained = undrainedResults[i];
    if (undrained.status === 'rejected') {
      console.error(`collectedFees:${chain}:${token}`, undrained.reason);
      fetchErrors.push(`collectedFees:${chain}:${token}`);
      undrainedFailures += 1;
      return;
    }
    const { collected, priceUsd } = undrained.value;
    const fees = trackerFees(collected, decimals, priceUsd, drainedByChain[chain]?.[model]);
    totalUsd += fees.usd;
    byToken[token] = (byToken[token] ?? 0) + fees.amount;
  });

  const holdLastValue = (source: string): MechMarketplaceFees => {
    const status = getFetchErrorAndCreateStaleStatus(source);
    return {
      feesCollected: { value: null, status },
      feesCollectedByToken: { value: null, status },
    };
  };

  if (undrainedFailures === MARKETPLACE_FEE_TRACKERS.length)
    return holdLastValue('collectedFees:all');
  if (!isSaneFeesUsd(totalUsd)) {
    console.error(`feesCollected: implausible total ${totalUsd}`);
    return holdLastValue('feesCollected:insane');
  }
  const decreased = fetchErrors.length === 0 ? findDecreasedToken(previous, byToken) : null;
  if (decreased) {
    console.error(
      `feesCollected: ${decreased} fell from ${previous?.[decreased]} to ${byToken[decreased]}`
    );
    return holdLastValue(`feesCollected:decreased:${decreased}`);
  }

  const status = createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs });
  return {
    feesCollected: { value: totalUsd.toFixed(2), status },
    feesCollectedByToken: { value: byToken, status },
  };
};

/** Total-only wrapper for the `agent-economies` snapshot (mech page). */
export const fetchMechMarketplaceFeesCollected = async (): Promise<
  MetricWithStatus<string | null>
> => (await fetchMechMarketplaceFees()).feesCollected;
