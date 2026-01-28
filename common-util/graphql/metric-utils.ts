import { CHAIN_CONFIG } from 'common-util/constants';
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';
import Web3 from 'web3';
import { MetricStatus, MetricWithStatus, WithMeta } from './types';

export const createStaleStatus = ({
  indexingErrors,
  fetchErrors,
  laggingSubgraphs = [],
}: {
  indexingErrors: string[];
  fetchErrors: string[];
  laggingSubgraphs?: string[];
}): MetricStatus => ({
  stale: indexingErrors.length > 0 || fetchErrors.length > 0 || laggingSubgraphs.length > 0,
  lastValidAt:
    indexingErrors.length === 0 && fetchErrors.length === 0 && laggingSubgraphs.length === 0
      ? Date.now()
      : null,
  indexingErrors: Array.from(new Set(indexingErrors)),
  fetchErrors: Array.from(new Set(fetchErrors)),
  laggingSubgraphs: Array.from(new Set(laggingSubgraphs)),
});

const blockCache: Record<string, { block: number; lastUpdated: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Function to get the latest block number for a given chain.
 * Uses in-memory cache to avoid redundant requests.
 */
export const getChainBlockNumber = async (chain: string): Promise<number | null> => {
  const chainConfig = CHAIN_CONFIG[chain];
  if (!chainConfig) return null;

  const currentTime = Date.now();
  const cachedBlock = blockCache[chain];

  if (cachedBlock && currentTime - cachedBlock.lastUpdated < CACHE_DURATION)
    return cachedBlock.block;

  try {
    const web3Instance = new Web3(chainConfig.rpc);
    const blockNumber = await web3Instance.eth.getBlockNumber();
    const block = Number(blockNumber);
    blockCache[chain] = { block, lastUpdated: currentTime };
    return block;
  } catch (error) {
    console.error(`Error fetching block number for ${chain}:`, error);
    return null;
  }
};

export const checkSubgraphLag = (
  chainBlock: number | null,
  subgraphBlockNumber: number | undefined,
  chain: string
): boolean => {
  if (!chainBlock || subgraphBlockNumber === undefined) return false;

  try {
    const subgraphBlock = subgraphBlockNumber;
    const config = CHAIN_CONFIG[chain];
    if (!config) return false;

    const lagLimit = config.lagLimit;
    return chainBlock - subgraphBlock > lagLimit;
  } catch {
    return false;
  }
};

type GraphQLQueryOptions<TData, TResult> = {
  client: GraphQLClient;
  query: RequestDocument;
  variables?: Variables;
  source: string;
  chain: string;
  transform: (data: TData) => TResult;
};

export async function executeGraphQLQuery<TData extends WithMeta<unknown>, TResult>({
  client,
  query,
  variables,
  source,
  transform,
  chain,
}: GraphQLQueryOptions<TData, TResult>): Promise<MetricWithStatus<TResult | null>> {
  const indexingErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const [data, chainBlock] = await Promise.all([
      client.request(query, variables) as Promise<TData>,
      getChainBlockNumber(chain),
    ]);

    if (data._meta?.hasIndexingErrors) {
      indexingErrors.push(source);
    }

    if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
      laggingSubgraphs.push(source);
    }

    const value = transform(data);

    return {
      value,
      status: createStaleStatus({ indexingErrors, fetchErrors: [], laggingSubgraphs }),
    };
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: [source],
        laggingSubgraphs: [],
      }),
    };
  }
}
