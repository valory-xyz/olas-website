import { Abi, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import olasAbi from '../data/ABIs/Olas.json';
import tokenomicsAbi from '../data/ABIs/Tokenomics.json';

const ETHEREUM_RPC = 'https://ethereum-rpc.publicnode.com';

export const olasAddress: `0x${string}` = '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0';
export const tokenomicsAddress: `0x${string}` = '0xc096362fa6f4A4B1a9ea68b1043416f3381ce300';

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
type ReadContractParams = {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: unknown[];
};
const readContract = ethereumClient.readContract as unknown as (
  params: ReadContractParams
) => Promise<unknown>;

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
