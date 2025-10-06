import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  activeVeOlasDepositorsQuery,
  holderCountsQuery,
} from 'common-util/graphql/queries';

const HOLDER_NETWORKS = [
  { key: 'ethereum', token: '0x0001A500A6B18995B03f44bb040A5fFc28E45CB0' },
  { key: 'arbitrum', token: '0x064F8B858C2A603e1b106a2039F5446D32dc81c1' },
  { key: 'base', token: '0x54330d28ca3357F294334BDC454a032e7f353416' },
  { key: 'celo', token: '0xaCFfAe8e57Ec6E394Eb1b41939A8CF7892DbDc51' },
  { key: 'gnosis', token: '0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f' },
  { key: 'optimism', token: '0xFC2E6e6BCbd49ccf3A5f029c79984372DcBFE527' },
  { key: 'polygon', token: '0xFEF5d947472e72Efbb2E388c730B7428406F2F95' },
];

const toLowerCaseAddress = (address) => address.toLowerCase();

const fetchHolderCount = ({ key, token }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return Promise.resolve(0);
  }

  return client
    .request(holderCountsQuery, { tokenId: toLowerCaseAddress(token) })
    .then((response) => Number(response?.token?.holderCount ?? 0));
};

const collectHolderCounts = () =>
  Promise.allSettled(
    HOLDER_NETWORKS.map((network) => fetchHolderCount(network)),
  );

const sumHolderCounts = (results) =>
  results.reduce((total, result) => {
    if (result.status !== 'fulfilled') {
      console.error('Failed to fetch holder count:', result.reason);
      return total;
    }

    return Number.isFinite(result.value) ? total + result.value : total;
  }, 0);

export const getTotalTokenHolders = async () => {
  const results = await collectHolderCounts();
  return sumHolderCounts(results);
};

const PAGE_SIZE = 1000;

const fetchActiveVeOlasDepositorsPage = async ({ skip, unlockAfter }) => {
  const client = TOKENOMICS_GRAPH_CLIENTS.ethereum;
  if (!client) {
    return [];
  }

  try {
    const response = await client.request(activeVeOlasDepositorsQuery, {
      first: PAGE_SIZE,
      skip,
      unlockAfter,
    });
    return response?.veolasDepositors ?? [];
  } catch (error) {
    console.error('Failed to fetch veOLAS depositors page:', error);
    return [];
  }
};

export const getActiveVeOlasHolders = async () => {
  const unlockAfter = Math.floor(Date.now() / 1000).toString();

  let skip = 0;
  let total = 0;

  while (true) {
    const depositors = await fetchActiveVeOlasDepositorsPage({
      skip,
      unlockAfter,
    });

    if (depositors.length === 0) {
      break;
    }

    total += depositors.length;

    if (depositors.length < PAGE_SIZE) {
      break;
    }

    skip += PAGE_SIZE;
  }

  return total;
};
