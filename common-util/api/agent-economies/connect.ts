import { CONNECT_AGENT_ID, CONNECT_CHAINS } from 'common-util/constants';
import { requestMarketplace, requestRegistry } from 'common-util/graphql/indexer-requests';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  getAgentMarketplaceRequestsQuery,
  getAgentMarketplaceRequestsSquidQuery,
  getAgentServicesPageQuery,
  getAgentServicesPageSquidQuery,
  getConnectRegistryQuery,
  getConnectRegistrySquidQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type ConnectChain = (typeof CONNECT_CHAINS)[number];

type ConnectRegistryResult = WithMeta<{
  dailyAgentPerformances: { dayTimestamp: string; activeMultisigCount: number }[];
  agentPerformances: { txCount: string }[];
}>;

type ConnectMarketplaceResult = WithMeta<{
  requestsPerAgents: { requestsCount: string }[];
}>;

type ServicesPage = WithMeta<{ services: { id: string }[] }>;

type Status = { indexingErrors: string[]; fetchErrors: string[]; laggingSubgraphs: string[] };

const SERVICES_PAGE_SIZE = 1000;
// Tens of Connect services per chain today; 20 pages is ample headroom.
const SERVICES_MAX_PAGES = 20;

/**
 * Runs one query per Connect chain alongside its head block, and hands each healthy
 * response to `read`. A rejected chain lands in `fetchErrors`, so `mergeWithFallback`
 * holds the previous value rather than publishing a total missing that chain.
 */
const queryConnectChains = async <T extends WithMeta<object>>(
  sourcePrefix: string,
  request: (chain: ConnectChain) => Promise<T>,
  read: (data: T) => void
): Promise<Status> => {
  const status: Status = { indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] };
  const results = await Promise.allSettled([
    ...CONNECT_CHAINS.map(request),
    ...CONNECT_CHAINS.map((chain) => getChainBlockNumber(chain)),
  ]);

  CONNECT_CHAINS.forEach((chain, index) => {
    const source = `${sourcePrefix}:${chain}`;
    const queryResult = results[index];
    const blockResult = results[index + CONNECT_CHAINS.length];

    if (queryResult.status === 'rejected') {
      console.error(source, queryResult.reason);
      status.fetchErrors.push(source);
      return;
    }
    const data = queryResult.value as T;
    const chainBlock = blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

    if (data._meta?.hasIndexingErrors) status.indexingErrors.push(source);
    if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
      status.laggingSubgraphs.push(source);
    }
    read(data);
  });

  return status;
};

/**
 * DAAs and successful executions, from the registry on each chain. DAAs are the 7-day
 * average of Safes that executed at least one transaction that day, summed across chains —
 * an instance runs on a single chain, so no Safe is counted twice. Executions are the
 * all-time `ExecutionSuccess` count of those Safes.
 */
const fetchConnectRegistryMetrics = async () => {
  const query = {
    agentId: CONNECT_AGENT_ID,
    timestamp_gt: getMidnightUtcTimestampDaysAgo(8),
    timestamp_lt: getMidnightUtcTimestampDaysAgo(0),
  };
  let activeMultisigDays = 0;
  let executions = 0;

  try {
    const status = await queryConnectChains<ConnectRegistryResult>(
      'registry',
      (chain) =>
        requestRegistry<ConnectRegistryResult>(chain, {
          subgraph: getConnectRegistryQuery(query),
          squid: getConnectRegistrySquidQuery(query),
        }),
      (data) => {
        (data.dailyAgentPerformances ?? []).forEach((day) => {
          activeMultisigDays += Number(day.activeMultisigCount ?? 0);
        });
        // No row yet means no Connect Safe has executed on this chain.
        executions += Number(data.agentPerformances?.[0]?.txCount ?? 0);
      }
    );
    const staleStatus = createStaleStatus(status);

    return {
      dailyActiveAgents: { value: activeMultisigDays / 7, status: staleStatus },
      onchainExecutions: { value: executions, status: staleStatus },
    };
  } catch (error) {
    console.error('Error fetching Connect registry metrics:', error);
    const status = getFetchErrorAndCreateStaleStatus('registry:connect');
    return {
      dailyActiveAgents: { value: null, status },
      onchainExecutions: { value: null, status },
    };
  }
};

/** All-time Olas Marketplace requests sent by Connect Safes, across chains. */
const fetchConnectMarketplaceRequests = async (): Promise<MetricWithStatus<number | null>> => {
  const query = { agentId: CONNECT_AGENT_ID };
  let requests = 0;

  try {
    const status = await queryConnectChains<ConnectMarketplaceResult>(
      'marketplace',
      (chain) =>
        requestMarketplace<ConnectMarketplaceResult>(chain, {
          subgraph: getAgentMarketplaceRequestsQuery(query),
          squid: getAgentMarketplaceRequestsSquidQuery(query),
        }),
      (data) => {
        requests += Number(data.requestsPerAgents?.[0]?.requestsCount ?? 0);
      }
    );
    return { value: requests, status: createStaleStatus(status) };
  } catch (error) {
    console.error('Error fetching Connect marketplace requests:', error);
    return { value: null, status: getFetchErrorAndCreateStaleStatus('marketplace:connect') };
  }
};

/**
 * Every Connect service ever minted, across chains — one service is one agent instance, so
 * this is the total the DAAs are a daily slice of. A truncated page walk throws, so the
 * chain lands in `fetchErrors` and the merge holds the last valid value.
 */
const fetchConnectTotalAgents = async (): Promise<MetricWithStatus<number | null>> => {
  let services = 0;

  try {
    const status = await queryConnectChains<ServicesPage>(
      'registry',
      async (chain) => {
        const ids = new Set<string>();
        let cursor = '';
        let page: ServicesPage;
        for (let pages = 1; ; pages += 1) {
          const query = { agentId: CONNECT_AGENT_ID, id_gt: cursor };
          page = await requestRegistry<ServicesPage>(chain, {
            subgraph: getAgentServicesPageQuery(query),
            squid: getAgentServicesPageSquidQuery(query),
          });
          const rows = page.services ?? [];
          rows.forEach((row) => ids.add(row.id));
          if (rows.length < SERVICES_PAGE_SIZE) break;
          if (pages >= SERVICES_MAX_PAGES) {
            throw new Error(`Connect services on ${chain} exceed ${SERVICES_MAX_PAGES} pages`);
          }
          cursor = rows[rows.length - 1].id;
        }
        return { ...page, services: [...ids].map((id) => ({ id })) };
      },
      (data) => {
        services += data.services.length;
      }
    );
    return { value: services, status: createStaleStatus(status) };
  } catch (error) {
    console.error('Error fetching Connect total agents:', error);
    return { value: null, status: getFetchErrorAndCreateStaleStatus('registry:connect') };
  }
};

export const fetchConnectMetrics = async () => {
  const [registry, totalAgents, marketplaceRequests] = await Promise.all([
    fetchConnectRegistryMetrics(),
    fetchConnectTotalAgents(),
    fetchConnectMarketplaceRequests(),
  ]);

  return {
    dailyActiveAgents: registry.dailyActiveAgents,
    totalAgents,
    marketplaceRequests,
    onchainExecutions: registry.onchainExecutions,
  };
};
