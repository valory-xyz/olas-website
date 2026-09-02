import { CHAIN_CONFIG, VOTE_WEIGHTING_ADDRESS } from 'common-util/constants';
import { Abi, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import olasAbi from '../data/ABIs/Olas.json';
import tokenomicsAbi from '../data/ABIs/Tokenomics.json';
import voteWeightingAbi from '../data/ABIs/VoteWeighting.json';

// Contract reads only run server-side (snapshot builders / cron), so the
// server-only ETHEREUM_RPC env var is preferred; the public node is a fallback.
const ETHEREUM_RPC = process.env.ETHEREUM_RPC || 'https://ethereum-rpc.publicnode.com';

export const olasAddress: `0x${string}` = '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0';
export const tokenomicsAddress: `0x${string}` = '0xc096362fa6f4A4B1a9ea68b1043416f3381ce300';
export const voteWeightingAddress = VOTE_WEIGHTING_ADDRESS as `0x${string}`;

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(ETHEREUM_RPC),
});

/**
 * viem's overloaded `readContract` generic mis-resolves under this repo's
 * tsconfig (it collapses the EIP-7702 `CallParameters` union and demands a
 * required `authorizationList`). We never rely on viem's arg/return inference
 * here — the ABIs are validated against the live contracts and results are cast
 * to the shapes the callers expect — so we call through a narrowed signature.
 */
export type ReadContractParams = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: unknown[];
};
export type ReadContractFn = (params: ReadContractParams) => Promise<unknown>;

const narrowReadContract = (client: { readContract: unknown }): ReadContractFn =>
  client.readContract as ReadContractFn;

const readContract = narrowReadContract(ethereumClient);

// Per-chain read-contract functions built from CHAIN_CONFIG RPCs (server-only).
// Note: unlike the Ethereum reader above, there is no public-RPC fallback — a
// missing env var returns null and the caller fails that chain's metric.
const readersByChain: Record<string, ReadContractFn> = {};

export const getChainReader = (chain: string): ReadContractFn | null => {
  if (readersByChain[chain]) return readersByChain[chain];
  const rpcUrl = CHAIN_CONFIG[chain]?.rpc;
  if (!rpcUrl) {
    console.error(`[web3] no RPC configured for chain: ${chain}`);
    return null;
  }
  readersByChain[chain] = narrowReadContract(createPublicClient({ transport: http(rpcUrl) }));
  return readersByChain[chain];
};

/**
 * Read-only call against the OLAS token contract on Ethereum mainnet.
 * Returns the decoded result exactly as viem decodes it (uint256 -> bigint).
 */
export const readOlasContract = <T = any>(functionName: string, args: unknown[] = []): Promise<T> =>
  readContract({
    address: olasAddress,
    abi: olasAbi as unknown as Abi,
    functionName,
    args,
  }) as Promise<T>;

/**
 * Read-only call against the Tokenomics contract on Ethereum mainnet.
 * Note on decoded shapes (verified against the live contract):
 * - functions with a single named-tuple output (e.g. `mapEpochTokenomics`) decode
 *   to an OBJECT keyed by the struct field names (use `.maxBondFraction`, not `['6']`).
 * - functions with multiple outputs (e.g. `mapEpochStakingPoints`) decode to an ARRAY
 *   (use positional indices, e.g. `[3]`).
 */
export const readTokenomicsContract = <T = any>(
  functionName: string,
  args: unknown[] = []
): Promise<T> =>
  readContract({
    address: tokenomicsAddress,
    abi: tokenomicsAbi as unknown as Abi,
    functionName,
    args,
  }) as Promise<T>;

export type StakingNominee = { account: `0x${string}`; chainId: bigint };

/**
 * All staking-contract nominees registered in the VoteWeighting contract on Ethereum —
 * the set of programs Olas officially keeps for voting (and thus keeps funding).
 * `account` is the staking instance address left-padded to bytes32; `chainId` is the
 * chain it lives on. Includes the zero placeholder (index 0) and the 0x...dEaD
 * retainer — callers filter those out.
 */
export const getAllStakingNominees = (): Promise<StakingNominee[]> =>
  readContract({
    address: voteWeightingAddress,
    abi: voteWeightingAbi as unknown as Abi,
    functionName: 'getAllNominees',
  }) as Promise<StakingNominee[]>;
