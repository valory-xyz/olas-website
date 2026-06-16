import { CHAIN_CONFIG } from 'common-util/constants';
import {
  createStaleStatus,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';
import { Abi, createPublicClient, formatUnits, http } from 'viem';

/**
 * Mech Marketplace "fees collected" metric.
 *
 * The MechMarketplace charges a protocol fee (currently 15% — `fee = 1500`,
 * `MAX_FEE_FACTOR = 10000`) on agent-to-agent payments. The fee is NOT stored on
 * the marketplace itself: each per-token `BalanceTracker` accrues it into a
 * `collectedFees` accumulator while processing payments, and `drain()` later sends
 * the balance to a drainer (non-OLAS → Olas Treasury, OLAS → burned) and resets
 * `collectedFees` to 0.
 *
 * We therefore read `collectedFees()` directly off each BalanceTracker — it is the
 * canonical, currently-held amount of collected (un-drained) protocol fees. There is
 * no cumulative counter in the contract; the value drops after each drain.
 *
 * SCOPE (current): we only count trackers denominated in a token that is ~= 1 USD,
 * so no price oracle is needed: USDC trackers (6 decimals) and the Gnosis native
 * tracker (xDAI, 18 decimals, ~= 1 USD). Mechs paid in OLAS or in non-USD native
 * tokens (ETH, POL, CELO) are NOT in use yet and are intentionally excluded.
 *
 * TODO: when mechs start using OLAS or non-USD native tokens, add the corresponding
 * trackers here together with price conversion to USD (Uniswap V2 OLAS/WETH for OLAS,
 * Chainlink feeds for ETH/POL/CELO native) — mirroring the pricing the new-mech-fees
 * subgraph already does. The currently-excluded trackers are listed in the comment below.
 *
 * TODO: `collectedFees()` only reflects fees not yet drained — it resets to 0 on each
 * `drain()`. To report lifetime fees collected (including already-distributed ones),
 * additionally sum the `Drained(address,uint256)` events each tracker emits.
 */

// BalanceTracker addresses denominated in a ~= 1 USD token, so the raw on-chain
// amount can be treated as USD after scaling by `decimals`. Sourced from the
// new-mech-fees subgraph manifests (subgraph.<chain>.yaml).
const USD_PEGGED_FEE_TRACKERS: {
  chain: keyof typeof CHAIN_CONFIG;
  address: `0x${string}`;
  decimals: number;
  token: string;
}[] = [
  // Gnosis native tracker — xDAI (~= 1 USD)
  {
    chain: 'gnosis',
    address: '0x21cE6799A22A3Da84B7c44a814a9c79ab1d2A50D',
    decimals: 18,
    token: 'xDAI',
  },
  // USDC trackers (USDC ~= 1 USD)
  {
    chain: 'ethereum',
    address: '0x897aee2e6F3d37740D334C55Caea2e0caC82aa14',
    decimals: 6,
    token: 'USDC',
  },
  {
    chain: 'arbitrum',
    address: '0xa987Fe40034AaD2EbB0E01B22DFc57f20C87F949',
    decimals: 6,
    token: 'USDC',
  },
  {
    chain: 'celo',
    address: '0xA749f605D93B3efcc207C54270d83C6E8fa70fF8',
    decimals: 6,
    token: 'USDC',
  },
  {
    chain: 'optimism',
    address: '0xA123748Ce7609F507060F947b70298D0bde621E6',
    decimals: 6,
    token: 'USDC',
  },
  {
    chain: 'polygon',
    address: '0x5C50ebc17d002A4484585C8fbf62f51953493c0B',
    decimals: 6,
    token: 'USDC',
  },
];

// TODO: enable these once the corresponding mechs are in use and USD price conversion
// is implemented (see file header). Non-USD native trackers (ETH/POL/CELO) and all
// OLAS trackers are excluded from the current "fees collected" total.
//
// Native (non-USD): ethereum 0x528befb0F8c6a988C9F42345DA6d053d66b3B9B6 (ETH),
//   base 0xB3921F8D8215603f0Bd521341Ac45eA8f2d274c1 (ETH),
//   optimism 0x4Cd816ce806FF1003ee459158A093F02AbF042a8 (ETH),
//   arbitrum 0x26Ea2dC7ce1b41d0AD0E0521535655d7a94b684c (ETH),
//   polygon 0xc096362fa6f4A4B1a9ea68b1043416f3381ce300 (POL),
//   celo 0x93111f6C267068A5d7356114D61d0f09bFD53a54 (CELO)
// OLAS: ethereum 0x02b576cc1bB21A84Dd8b59013777C150ea64c482, gnosis 0x53Bd432516707a5212A70216284a99A563aAC1D1,
//   base 0x43fB32f25dce34EB76c78C7A42C8F40F84BCD237, arbitrum 0x5dfb0d37f2A28023CDBa46D2f015A90564Cf9586,
//   celo 0x3912381bAa2935a0fc03c173Df366A459DAc1F43, optimism 0x70A0D93fb0dB6EAab871AB0A3BE279DcA37a2bcf,
//   polygon 0x1521918961bDBC9Ed4C67a7103D5999e4130E6CB

const COLLECTED_FEES_ABI = [
  {
    name: 'collectedFees',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const satisfies Abi;

/**
 * Reads `collectedFees()` from a single BalanceTracker and returns the amount as a
 * USD number (the tracker's token is ~= 1 USD). Throws on RPC/read failure so the
 * caller can record a per-tracker fetch error.
 */
const readCollectedFeesUsd = async (
  tracker: (typeof USD_PEGGED_FEE_TRACKERS)[number]
): Promise<number> => {
  const rpc = CHAIN_CONFIG[tracker.chain]?.rpc;
  if (!rpc) throw new Error(`Missing RPC for ${tracker.chain}`);

  const client = createPublicClient({ transport: http(rpc) });
  // viem's overloaded `readContract` generic mis-resolves under this repo's tsconfig
  // (see common-util/web3.ts) — call through a narrowed signature.
  const readContract = client.readContract as unknown as (params: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
  }) => Promise<bigint>;

  const collected = await readContract({
    address: tracker.address,
    abi: COLLECTED_FEES_ABI as unknown as Abi,
    functionName: 'collectedFees',
  });

  return Number(formatUnits(collected, tracker.decimals));
};

/**
 * Sums `collectedFees()` (in USD) across all USD-pegged BalanceTrackers and returns
 * the total as a `MetricWithStatus<string | null>` (string matches the `mechFees`
 * shape used elsewhere). Used by both the `main` snapshot (homepage "fees collected")
 * and the `agent-economies` snapshot (mech page "Marketplace Fees Collected").
 */
export const fetchMechMarketplaceFeesCollected = async (): Promise<
  MetricWithStatus<string | null>
> => {
  const fetchErrors: string[] = [];

  const results = await Promise.allSettled(USD_PEGGED_FEE_TRACKERS.map(readCollectedFeesUsd));

  let totalUsd = 0;
  results.forEach((result, i) => {
    const { chain, token } = USD_PEGGED_FEE_TRACKERS[i];
    if (result.status === 'rejected') {
      console.error(`collectedFees:${chain}:${token}`, result.reason);
      fetchErrors.push(`collectedFees:${chain}:${token}`);
      return;
    }
    totalUsd += result.value;
  });

  // All reads failed — bubble up null so mergeWithFallback preserves the last valid value.
  if (fetchErrors.length === USD_PEGGED_FEE_TRACKERS.length) {
    return { value: null, status: getFetchErrorAndCreateStaleStatus('collectedFees:all') };
  }

  return {
    value: totalUsd.toFixed(2),
    status: createStaleStatus({ indexingErrors: [], fetchErrors, laggingSubgraphs: [] }),
  };
};
