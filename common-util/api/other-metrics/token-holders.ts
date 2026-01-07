import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { holderCountsQuery } from 'common-util/graphql/queries';
import tokens from 'data/tokens.json';
import { sum } from 'lodash';

type HolderCountsResult = {
  token: {
    holderCount: string;
  };
};

const fetchHolderCount = async ({
  key,
  tokenAddress,
}: {
  key: string;
  tokenAddress: string;
}) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return 0;
  }

  try {
    const response: HolderCountsResult = await client.request(
      holderCountsQuery,
      {
        tokenId: tokenAddress,
      }
    );
    return Number(response?.token?.holderCount ?? 0);
  } catch (error) {
    console.error(`Token holder subgraph request failed for ${key}:`, error);
    return 0;
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
    const holderCounts = await getHolderCounts(networks);
    const totalTokenHolders = sum(holderCounts);

    return { totalTokenHolders };
  } catch (error) {
    console.error('Failed to aggregate token holder counts:', error);
    return null;
  }
};
