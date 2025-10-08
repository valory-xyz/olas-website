import { CACHE_DURATION_SECONDS, VEOLAS_TOKEN_ID } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  activeVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';

const PAGE_SIZE = 1000;
const BUFFER_SECONDS = 60;

const fetchLockedBalance = async () => {
  const client = TOKENOMICS_GRAPH_CLIENTS.ethereum;
  if (!client) {
    return null;
  }

  try {
    const response = await client.request(veOlasLockedBalanceQuery, {
      tokenId: VEOLAS_TOKEN_ID,
    });
    return response?.token?.balance ?? '0';
  } catch (error) {
    console.error('Error fetching veOLAS locked balance:', error);
    return null;
  }
};

const buildVeOlasNetworks = () => [{ key: 'ethereum' }];
const fetchActiveDepositorCount = async ({ key }, unlockAfter) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return 0;
  }

  let skip = 0;
  let total = 0;

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await client.request(activeVeOlasDepositorsQuery, {
        first: PAGE_SIZE,
        skip,
        unlockAfter,
      });
      const page = result?.veolasDepositors ?? [];
      total += page.length;
      if (page.length < PAGE_SIZE) {
        break;
      }
      skip += PAGE_SIZE;
    }

    return total;
  } catch (error) {
    console.error(`Error fetching active veOLAS depositors for ${key}:`, error);
    return 0;
  }
};

const getActiveDepositorCounts = (networks, unlockAfter) =>
  Promise.all(
    networks.map((network) => fetchActiveDepositorCount(network, unlockAfter)),
  );

const countActiveDepositors = async () => {
  const unlockAfter = `${Math.floor(Date.now() / 1000) + BUFFER_SECONDS}`;

  const networks = buildVeOlasNetworks();
  const counts = await getActiveDepositorCounts(networks, unlockAfter);
  return counts.reduce((sum, count) => sum + count, 0);
};

const getVeOlasMetrics = async () => {
  const [lockedBalance, activeHolders] = await Promise.all([
    fetchLockedBalance(),
    countActiveDepositors(),
  ]);

  return {
    lockedOlas: lockedBalance ? Number(lockedBalance) / 1e18 : null,
    activeHolders,
  };
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
    const metrics = await getVeOlasMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('Failed to fetch veOLAS metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch veOLAS metrics.' });
  }
}
