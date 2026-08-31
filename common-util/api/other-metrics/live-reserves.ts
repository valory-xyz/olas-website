import { getChainReader } from 'common-util/web3';
import { Abi } from 'viem';

// Live pool reserves read via RPC. The per-chain liquidity subgraphs index the
// pool contract only, so Balancer swaps (executed on the Vault) never reach
// them and their reserve0/reserve1 drift between joins/exits — up to 75% off.
// See docs/pol-live-reserves.md.

// Balancer V2 Vault — same address on every chain it's deployed to.
const BALANCER_VAULT_ADDRESS: `0x${string}` = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

const BALANCER_POOL_ABI = [
  {
    inputs: [],
    name: 'getPoolId',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const BALANCER_VAULT_ABI = [
  {
    inputs: [{ internalType: 'bytes32', name: 'poolId', type: 'bytes32' }],
    name: 'getPoolTokens',
    outputs: [
      { internalType: 'contract IERC20[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'balances', type: 'uint256[]' },
      { internalType: 'uint256', name: 'lastChangeBlock', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const UNISWAP_V2_PAIR_ABI = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: 'reserve0', type: 'uint112' },
      { internalType: 'uint112', name: 'reserve1', type: 'uint112' },
      { internalType: 'uint32', name: 'blockTimestampLast', type: 'uint32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token0',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Raw reserves in token-address order (reserve0 = lower address), matching the
// subgraph's reserve0/reserve1 convention. `tokens` carries the source-reported
// token addresses (Vault getPoolTokens / pair token0+token1) so callers can
// verify ordering.
export type LiveReserves = {
  reserve0: string;
  reserve1: string;
  tokens: [string, string];
};

export const fetchBalancerPoolReserves = async (
  chain: string,
  poolAddress: string
): Promise<LiveReserves | null> => {
  try {
    const read = getChainReader(chain);
    if (!read) return null;

    const poolId = (await read({
      address: poolAddress as `0x${string}`,
      abi: BALANCER_POOL_ABI as unknown as Abi,
      functionName: 'getPoolId',
    })) as `0x${string}`;

    const result = (await read({
      address: BALANCER_VAULT_ADDRESS,
      abi: BALANCER_VAULT_ABI as unknown as Abi,
      functionName: 'getPoolTokens',
      args: [poolId],
    })) as [string[], bigint[], bigint];

    const [tokens, balances] = result;
    // Exactly two tokens: a pool of any other shape would silently mis-map
    // onto the two-reserve config, so fail it instead.
    if (!tokens || !balances || tokens.length !== 2 || balances.length !== 2) return null;

    return {
      reserve0: balances[0].toString(),
      reserve1: balances[1].toString(),
      tokens: [tokens[0], tokens[1]],
    };
  } catch (error) {
    console.error(`[live-reserves] Balancer read failed (${chain} ${poolAddress}):`, error);
    return null;
  }
};

export const fetchUniswapV2PairReserves = async (
  chain: string,
  pairAddress: string
): Promise<LiveReserves | null> => {
  try {
    const read = getChainReader(chain);
    if (!read) return null;

    const pairContract = {
      address: pairAddress as `0x${string}`,
      abi: UNISWAP_V2_PAIR_ABI as unknown as Abi,
    };
    const [reserves, token0, token1] = (await Promise.all([
      read({ ...pairContract, functionName: 'getReserves' }),
      read({ ...pairContract, functionName: 'token0' }),
      read({ ...pairContract, functionName: 'token1' }),
    ])) as [[bigint, bigint, number], string, string];

    if (reserves?.[0] === undefined || reserves?.[1] === undefined || !token0 || !token1) {
      return null;
    }

    return {
      reserve0: reserves[0].toString(),
      reserve1: reserves[1].toString(),
      tokens: [token0, token1],
    };
  } catch (error) {
    console.error(`[live-reserves] UniswapV2 read failed (${chain} ${pairAddress}):`, error);
    return null;
  }
};
