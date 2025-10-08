import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { holderCountsQuery } from 'common-util/graphql/queries';
import tokens from 'data/tokens.json';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const TOKEN_HOLDER_NAME_MAP = {
  ethereum: 'Ethereum',
  arbitrum: 'Arbitrum',
  base: 'Base',
  celo: 'Celo',
  gnosis: 'Gnosis',
  optimism: 'Optimism',
  polygon: 'Polygon PoS',
  mode: 'Mode',
};

const fetchHolderCount = async ({ key, token }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return 0;
  }

  try {
    const response = await client.request(holderCountsQuery, {
      tokenId: token.toLowerCase(),
    });
    return Number(response?.token?.holderCount ?? 0);
  } catch (error) {
    console.error(`Token holder subgraph request failed for ${key}:`, error);
    return 0;
  }
};

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
    const lookup = tokens.reduce((map, { name, address }) => {
      map[name] = address;
      return map;
    }, {});

    const networks = Object.entries(TOKEN_HOLDER_NAME_MAP).map(
      ([key, name]) => {
        const token = lookup[name];
        if (!token) {
          throw new Error(`Missing token address for ${name}`);
        }
        return { key, token };
      },
    );

    const counts = await Promise.all(
      networks.map((network) => fetchHolderCount(network)),
    );

    const totalTokenHolders = counts.reduce((total, value) => {
      return Number.isFinite(value) ? total + value : total;
    }, 0);

    return res.status(200).json({ totalTokenHolders });
  } catch (error) {
    console.error('Failed to aggregate token holder counts:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch token holder metrics.' });
  }
}
