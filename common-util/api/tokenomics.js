import { VEOLAS_TOKEN_ID } from 'common-util/constants';
import { TOKEN_HOLDER_NETWORKS } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  activeVeOlasDepositorsQuery,
  holderCountsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';

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
    TOKEN_HOLDER_NETWORKS.map((network) => fetchHolderCount(network)),
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

export const getVeOlasLockedBalance = async () => {
  const client = TOKENOMICS_GRAPH_CLIENTS.ethereum;
  if (!client) {
    return 0;
  }

  try {
    const response = await client.request(veOlasLockedBalanceQuery, {
      tokenId: VEOLAS_TOKEN_ID.toLowerCase(),
    });
    const balance = response?.token?.balance;
    if (!balance) {
      return 0;
    }
    const numeric = Number(balance);
    if (!Number.isFinite(numeric)) {
      return 0;
    }
    return numeric / 1e18;
  } catch (error) {
    console.error('Failed to fetch veOLAS locked balance:', error);
    return 0;
  }
};
