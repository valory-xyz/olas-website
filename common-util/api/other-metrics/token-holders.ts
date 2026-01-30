import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { holderCountsQuery } from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';
import tokens from 'data/tokens.json';

type HolderCountsResult = WithMeta<{
  token: {
    holderCount: string;
  };
}>;

const fetchHolderCount = async ({ key, tokenAddress }: { key: string; tokenAddress: string }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];

  if (!client) {
    return { count: 0, error: null, hasIndexingErrors: false, hasLaggingSubgraphs: false };
  }

  try {
    const response: HolderCountsResult = await client.request(holderCountsQuery, {
      tokenId: tokenAddress,
    });
    const chainBlock = await getChainBlockNumber(key);
    const hasLaggingSubgraphs = checkSubgraphLag(chainBlock, response?._meta?.block?.number, key);

    return {
      count: Number(response?.token?.holderCount ?? 0),
      error: null,
      hasIndexingErrors: response._meta?.hasIndexingErrors,
      hasLaggingSubgraphs,
    };
  } catch (error) {
    console.error(`Token holder subgraph request failed for ${key}:`, error);
    return {
      count: 0,
      error: `tokenHolders:${key}`,
      hasIndexingErrors: false,
      hasLaggingSubgraphs: false,
    };
  }
};

const buildTokenHolderNetworks = () => {
  const networks: { key: string; tokenAddress: string }[] = [];

  tokens.forEach(({ key, name, address }) => {
    if (!key) {
      return;
    }

    if (!address) {
      throw new Error(`Missing token address for ${name || key}`);
    }

    networks.push({ key, tokenAddress: address });
  });

  return networks;
};

const getHolderCounts = (networks: { key: string; tokenAddress: string }[]) =>
  Promise.all(networks.map((network) => fetchHolderCount(network)));

export const fetchTokenHolders = async () => {
  try {
    const networks = buildTokenHolderNetworks();
    const results = await getHolderCounts(networks);

    const indexingErrors: string[] = [];
    const fetchErrors: string[] = [];
    const laggingSubgraphs: string[] = [];
    let totalTokenHolders = 0;

    results.forEach((result, index) => {
      const network = networks[index].key;
      totalTokenHolders += result.count;
      if (result.error) {
        fetchErrors.push(result.error);
      }
      if (result.hasIndexingErrors) {
        indexingErrors.push(`tokenHolders:${network}`);
      }
      if (result.hasLaggingSubgraphs) {
        laggingSubgraphs.push(`tokenHolders:${network}`);
      }
    });

    return {
      totalTokenHolders: {
        value: totalTokenHolders,
        status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
      },
    };
  } catch (error) {
    console.error('Failed to aggregate token holder counts:', error);
    return {
      totalTokenHolders: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('tokenHolders:all'),
      },
    };
  }
};
