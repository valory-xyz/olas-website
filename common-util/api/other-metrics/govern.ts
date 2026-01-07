import { VEOLAS_TOKEN_ID } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  getActiveVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';
import { sum } from 'lodash';

const LIMIT = 1000;
const PAGES = 5;
const BUFFER_SECONDS = 60;

type VeOlasLockedBalanceResult = {
  token: {
    balance: string;
  };
};

const fetchLockedBalance = async () => {
  const client = TOKENOMICS_GRAPH_CLIENTS.ethereum;
  if (!client) {
    return null;
  }

  try {
    const response: VeOlasLockedBalanceResult = await client.request(
      veOlasLockedBalanceQuery,
      {
        tokenId: VEOLAS_TOKEN_ID,
      }
    );
    return response?.token?.balance ?? '0';
  } catch (error) {
    console.error('Error fetching veOLAS locked balance:', error);
    return null;
  }
};

const buildVeOlasNetworks = () => [{ key: 'ethereum' }];

type ActiveVeOlasDepositorsResult = {
  veolasDepositors: { id: string; unlockTimestamp: string }[];
};

const fetchActiveDepositorCount = async (
  { key }: { key: string },
  unlockAfter: string
) => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];
  if (!client) {
    return 0;
  }

  let skip = 0;
  let allDepositors: ActiveVeOlasDepositorsResult['veolasDepositors'] = [];

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response: ActiveVeOlasDepositorsResult = await client.request(
        getActiveVeOlasDepositorsQuery({
          first: LIMIT,
          skip,
          pages: PAGES,
          unlockAfter,
        })
      );

      const pageData = Object.values(response).flat();

      allDepositors = allDepositors.concat(pageData);
      skip += LIMIT * PAGES;

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

const getActiveDepositorCounts = (
  networks: { key: string }[],
  unlockAfter: string
) =>
  Promise.all(
    networks.map((network) => fetchActiveDepositorCount(network, unlockAfter))
  );

const countActiveDepositors = async () => {
  // Unlocks after the specified time.
  // If BUFFER_SECONDS = 60, the unlock will occur after 1 minute.
  const unlockAfter = `${Math.floor(Date.now() / 1000) + BUFFER_SECONDS}`;
  const networks = buildVeOlasNetworks();
  const counts = await getActiveDepositorCounts(networks, unlockAfter);
  return sum(counts);
};

export const fetchGovernMetrics = async () => {
  try {
    const [lockedBalance, activeHolders] = await Promise.all([
      fetchLockedBalance(),
      countActiveDepositors(),
    ]);

    return {
      lockedOlas: lockedBalance ? Number(lockedBalance) / 1e18 : null,
      activeHolders,
    };
  } catch (error) {
    console.error('Error in fetchGovernMetrics:', error);
    return null;
  }
};
