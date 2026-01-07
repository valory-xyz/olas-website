import { CACHE_DURATION_SECONDS, VEOLAS_TOKEN_ID } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  getActiveVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';
import { sum } from 'lodash';
const LIMIT = 1000;
const PAGES = 5;
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

    // @ts-expect-error TS(2339) FIXME: Property 'token' does not exist on type 'unknown'.
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
  let allDepositors = [];

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await client.request(
        getActiveVeOlasDepositorsQuery({
          first: LIMIT,
          skip,
          pages: PAGES,
          unlockAfter,
        }),
      );

      const pageData = Object.values(response).flat();

      allDepositors = allDepositors.concat(pageData);
      skip += LIMIT * PAGES;

      // If the returned page is empty, or the amount of items is less
      // than the limit, we're on the last page
      if (
        !Array.isArray(pageData) ||
        pageData.length === 0 ||
        pageData.length < LIMIT * PAGES
      ) {
        break;
      }
    }
  } catch (e) {
    console.error("Couldn't fetch all depositors", e);
  }

  return allDepositors.length;
};

const getActiveDepositorCounts = (networks, unlockAfter) =>
  Promise.all(
    networks.map((network) => fetchActiveDepositorCount(network, unlockAfter)),
  );

const countActiveDepositors = async () => {
  // Unlocks after the specified time.
  // If BUFFER_SECONDS = 60, the unlock will occur after 1 minute.
  const unlockAfter = `${Math.floor(Date.now() / 1000) + BUFFER_SECONDS}`;

  const networks = buildVeOlasNetworks();
  const counts = await getActiveDepositorCounts(networks, unlockAfter);
  return sum(counts);
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
