import { VEOLAS_TOKEN_ID } from 'common-util/constants';
import { TOKENOMICS_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  executeGraphQLQuery,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  getActiveVeOlasDepositorsQuery,
  veOlasLockedBalanceQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';

const LIMIT = 1000;
const PAGES = 5;
const BUFFER_SECONDS = 60;

type VeOlasLockedBalanceResult = WithMeta<{
  token: {
    balance: string;
  };
}>;

const fetchLockedBalance = async (): Promise<MetricWithStatus<string | null>> => {
  const client = TOKENOMICS_GRAPH_CLIENTS.ethereum;
  if (!client) {
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('govern:lockedBalance'),
    };
  }

  return executeGraphQLQuery<VeOlasLockedBalanceResult, string>({
    client,
    query: veOlasLockedBalanceQuery,
    variables: { tokenId: VEOLAS_TOKEN_ID },
    source: 'govern:lockedBalance',
    chain: 'ethereum',
    transform: (data) => data?.token?.balance ?? '0',
  });
};

const buildVeOlasNetworks = () => [{ key: 'ethereum' }];

type Depositor = { id: string; unlockTimestamp: string };
type ActiveVeOlasDepositorsResult = WithMeta<Record<string, Depositor[]>>;

const fetchActiveDepositorCount = async (
  { key }: { key: string },
  unlockAfter: string
): Promise<{ count: number; indexingErrors: string[]; laggingSubgraphs: string[] }> => {
  const client = TOKENOMICS_GRAPH_CLIENTS[key];

  if (!client) {
    return { count: 0, indexingErrors: [], laggingSubgraphs: [] };
  }

  let skip = 0;
  let allDepositors: Depositor[] = [];

  const indexingErrors = [];
  const laggingSubgraphs = [];

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
      const chainBlock = await getChainBlockNumber(key);

      if (response._meta?.hasIndexingErrors) {
        indexingErrors.push(`govern:activeHolders:${key}`);
      }
      if (checkSubgraphLag(chainBlock, response?._meta?.block?.number, key)) {
        laggingSubgraphs.push(`govern:activeHolders:${key}`);
      }

      const pageData = Object.entries(response)
        .filter(([k]) => k.startsWith('_page'))
        .flatMap(([, v]) => v as any) as Depositor[];

      allDepositors = allDepositors.concat(pageData);
      skip += LIMIT * PAGES;

      if (!Array.isArray(pageData) || pageData.length === 0 || pageData.length < LIMIT * PAGES) {
        break;
      }
    }
  } catch (e) {
    console.error("Couldn't fetch all depositors", e);
  }

  return { count: allDepositors.length, indexingErrors, laggingSubgraphs };
};

const getActiveDepositorCounts = (networks: { key: string }[], unlockAfter: string) =>
  Promise.all(networks.map((network) => fetchActiveDepositorCount(network, unlockAfter)));

const countActiveDepositors = async (): Promise<MetricWithStatus<number | null>> => {
  try {
    // Unlocks after the specified time.
    // If BUFFER_SECONDS = 60, the unlock will occur after 1 minute.
    const unlockAfter = `${Math.floor(Date.now() / 1000) + BUFFER_SECONDS}`;
    const networks = buildVeOlasNetworks();
    const results = await getActiveDepositorCounts(networks, unlockAfter);

    let total = 0;
    const indexingErrors: string[] = [];
    const fetchErrors: string[] = [];
    const laggingSubgraphs: string[] = [];

    results.forEach((res) => {
      total += res.count;
      if (res.indexingErrors.length > 0) {
        indexingErrors.push(...res.indexingErrors);
      }
      if (res.laggingSubgraphs.length > 0) {
        laggingSubgraphs.push(...res.laggingSubgraphs);
      }
    });

    return {
      value: total,
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error counting active depositors:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('govern:activeHolders'),
    };
  }
};

export const fetchGovernMetrics = async () => {
  try {
    const [lockedBalanceResult, activeHoldersResult] = await Promise.allSettled([
      fetchLockedBalance(),
      countActiveDepositors(),
    ]);

    const handleResult = <T>(
      result: PromiseSettledResult<MetricWithStatus<T>>,
      errorSource: string
    ): MetricWithStatus<T> => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      console.error(`Fetch ${errorSource} failed:`, result.reason);
      return {
        value: null,
        status: getFetchErrorAndCreateStaleStatus(errorSource),
      };
    };

    const lockedBalanceRaw = handleResult(lockedBalanceResult, 'govern:lockedBalance');
    const lockedOlas: MetricWithStatus<number | null> = {
      value: lockedBalanceRaw.value ? Number(lockedBalanceRaw.value) / 1e18 : null,
      status: lockedBalanceRaw.status,
    };
    const activeHolders = handleResult(activeHoldersResult, 'govern:activeHolders');

    return {
      lockedOlas,
      activeHolders,
    };
  } catch (error) {
    console.error('Error in fetchGovernMetrics:', error);
    return {
      lockedOlas: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('govern:lockedBalance'),
      },
      activeHolders: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('govern:activeHolders'),
      },
    };
  }
};
