import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { holderCountsQuery } from 'common-util/graphql/queries';
import tokens from 'data/tokens.json';
import { sum } from 'lodash';

const fetchHolderCount = async ({ key, tokenAddress }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return 0;
  }

  try {
    const response = await client.request(holderCountsQuery, {
      tokenId: tokenAddress,
    });
    return Number(response?.token?.holderCount ?? 0);
  } catch (error) {
    console.error(`Token holder subgraph request failed for ${key}:`, error);
    return 0;
  }
};

const buildTokenHolderNetworks = () => {
  const networks = [];

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

const getHolderCounts = (networks) =>
  Promise.all(networks.map((network) => fetchHolderCount(network)));

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Vercel-CDN-Cache-Control',
    `s-maxage=${CACHE_DURATION_SECONDS}`,
  );
  res.setHeader('CDN-Cache-Control', `s-maxage=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
  );

  try {
    const networks = buildTokenHolderNetworks();
    const holderCounts = await getHolderCounts(networks);
    const totalTokenHolders = sum(holderCounts);

    return res.status(200).json({ totalTokenHolders });
  } catch (error) {
    console.error('Failed to aggregate token holder counts:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch token holder metrics.' });
  }
}
