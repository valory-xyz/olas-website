import { TOKENOMICS_GRAPH_CLIENTS, TOKENOMICS_SQUID_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { holderCountsQuery, holderCountsSquidQuery } from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';
import tokens from 'data/tokens.json';

type HolderCountsResult = WithMeta<{
  token: {
    holderCount: string | number;
  } | null;
}>;

type HolderCountsSquidResult = {
  token: { holderCount: string | number } | null;
  squidStatus?: { height?: number | string | null } | null;
};

/**
 * Subgraph chains answer `holderCountsQuery` directly; squid chains (OpenReader dialect)
 * answer `holderCountsSquidQuery`, whose `squidStatus` is mapped to `_meta` so the caller
 * stays dialect-blind — same shape as `common-util/graphql/indexer-requests.ts`.
 * Returns `undefined` when the chain has no tokenomics indexer.
 */
const requestHolderCount = async (
  key: string,
  tokenAddress: string
): Promise<HolderCountsResult | undefined> => {
  const graphClient = TOKENOMICS_GRAPH_CLIENTS[key];
  if (graphClient) {
    return graphClient.request<HolderCountsResult>(holderCountsQuery, { tokenId: tokenAddress });
  }

  const squidClient = TOKENOMICS_SQUID_CLIENTS[key];
  if (!squidClient) return undefined;

  // Squid string IDs are case-sensitive and stored lowercased; a checksummed address
  // returns `token: null`.
  const { squidStatus, token } = await squidClient.request<HolderCountsSquidResult>(
    holderCountsSquidQuery,
    { tokenId: tokenAddress.toLowerCase() }
  );
  // Squids have no indexing-error flag: a failed handler stops the processor, which
  // surfaces as lag instead.
  const height = squidStatus?.height;
  return {
    token,
    _meta:
      height == null ? undefined : { hasIndexingErrors: false, block: { number: Number(height) } },
  };
};

const fetchHolderCount = async ({ key, tokenAddress }: { key: string; tokenAddress: string }) => {
  if (!TOKENOMICS_GRAPH_CLIENTS[key] && !TOKENOMICS_SQUID_CLIENTS[key]) {
    return { count: 0, error: null, hasIndexingErrors: false, hasLaggingSubgraphs: false };
  }

  try {
    const response = await requestHolderCount(key, tokenAddress);
    const chainBlock = await getChainBlockNumber(key);
    const hasLaggingSubgraphs = checkSubgraphLag(chainBlock, response?._meta?.block?.number, key);

    // An absent token entity is a failure, not zero holders — recording it as an error
    // keeps the chain out of the sum and lets mergeWithFallback hold the last good total.
    if (response?.token?.holderCount == null) {
      console.error(`tokenHolders:${key}: subgraph responded without token.holderCount`);
      return {
        count: 0,
        error: `tokenHolders:${key}:missingGlobal`,
        hasIndexingErrors: response?._meta?.hasIndexingErrors,
        hasLaggingSubgraphs,
      };
    }

    return {
      count: Number(response.token.holderCount),
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
