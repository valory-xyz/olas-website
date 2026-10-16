import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { MECH_AGENT_CLASSIFICATION } from 'common-util/constants';
import { MARKETPLACE_GRAPH_CLIENTS, REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { MARKETPLACE_CHAIN_KEYS, type MarketplaceChain } from 'common-util/indexers';
import { type IndexerQuery, requestMarketplace } from 'common-util/graphql/indexer-requests';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
  readGlobalField,
} from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyMechAgentPerformancesQuery,
  mechMarketplaceRequestsPerAgentsQuery,
  mechMarketplaceTotalRequestsQuery,
  mechMarketplaceTotalRequestsSquidQuery,
  mechOffChainDeliveriesPageQuery,
  mechOffChainDeliveriesPageSquidQuery,
  mechOffChainSendersPageQuery,
  mechOffChainSendersPageSquidQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { type ChainRequestSplit, parseCount, splitChainRequests } from './mech-requests-math';

type DailyMechAgentPerformancesResult = WithMeta<{
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
}>;

const fetchDailyAgentPerformance = async (): Promise<MetricWithStatus<number | null>> => {
  const chains = ['gnosis', 'base', 'polygon'] as const;
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      })
    );
    const blockPromises = chains.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const performancesByChains: { activeMultisigCount: number }[][] = [];

    chains.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + chains.length];

      if (queryResult.status === 'rejected') {
        console.error(`registry:${chain}`, queryResult.reason);
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = queryResult.value as DailyMechAgentPerformancesResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`registry:${chain}`);
        }
        performancesByChains.push(data.dailyAgentPerformances ?? []);
      }
    });

    const totalAverage = performancesByChains.reduce(
      (sum, performances) => sum + calculate7DayAverage(performances, 'activeMultisigCount'),
      0
    );

    return {
      value: totalAverage,
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching marketplace daily agent performances:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus(
        chains.map((chain) => `registry:${chain}`).join(', ')
      ),
    };
  }
};

type MechGlobalsResult = WithMeta<{
  global: {
    totalRequests: string;
    totalDeliveries: string;
  };
}>;

type MechGlobals = {
  requests: number;
  deliveries: number;
  onChainRequests: number;
  offChainRequests: number;
};

const OFF_CHAIN_PAGE_SIZE = 1000;
const OFF_CHAIN_MAX_PAGES = 500;

/**
 * Walks an id-ordered page query to the end and sums one count field. Subgraph pages are
 * pinned to `block`; squids cannot time-travel, so theirs read the latest state. A walk
 * that reaches the page cap throws, so the chain is refused instead of publishing a
 * truncated sum.
 */
const sumMarketplacePages = async (
  chain: MarketplaceChain,
  query: IndexerQuery,
  rowsKey: string,
  field: string,
  block: number | undefined
): Promise<number> => {
  const isSubgraph = chain in MARKETPLACE_GRAPH_CLIENTS;
  if (isSubgraph && block === undefined) {
    throw new Error(`marketplace:${chain} returned no block to pin off-chain pages to`);
  }
  let sum = 0;
  let lastId = isSubgraph ? '0x' : '';
  for (let pages = 1; ; pages += 1) {
    const page = await requestMarketplace<Record<string, Record<string, string>[]>>(
      chain,
      query,
      isSubgraph ? { block, lastId } : { lastId }
    );
    const rows = page[rowsKey] ?? [];
    rows.forEach((row) => {
      sum += parseCount(row[field]);
    });
    if (rows.length < OFF_CHAIN_PAGE_SIZE) return sum;
    if (pages >= OFF_CHAIN_MAX_PAGES) {
      throw new Error(`marketplace:${chain} ${rowsKey} exceeds ${OFF_CHAIN_MAX_PAGES} pages`);
    }
    lastId = rows[rows.length - 1].id;
  }
};

const fetchChainRequestSplit = async (
  chain: MarketplaceChain,
  data: MechGlobalsResult,
  source: string,
  fetchErrors: string[]
): Promise<ChainRequestSplit | null> => {
  // The query didn't fail, so a null Global just means no marketplace activity on
  // this chain yet — expected, chains are wired up ahead of launch.
  const globalEntity = data.global ?? { totalRequests: '0', totalDeliveries: '0' };
  const requests = readGlobalField(globalEntity, 'totalRequests', source, fetchErrors);
  const deliveries = readGlobalField(globalEntity, 'totalDeliveries', source, fetchErrors);
  if (requests === null || deliveries === null) return null;

  const block = data._meta?.block?.number;
  const [senderOffChain, offChain] = await Promise.all([
    sumMarketplacePages(
      chain,
      { subgraph: mechOffChainSendersPageQuery, squid: mechOffChainSendersPageSquidQuery },
      'senders',
      'totalOffChainRequests',
      block
    ),
    sumMarketplacePages(
      chain,
      {
        subgraph: mechOffChainDeliveriesPageQuery,
        squid: mechOffChainDeliveriesPageSquidQuery,
      },
      'marketplaceDeliveryWithSignatures_collection',
      'numDeliveries',
      block
    ),
  ]);
  return splitChainRequests({
    totalRequests: parseCount(requests),
    totalDeliveries: parseCount(deliveries),
    senderOffChain,
    offChain,
  });
};

/**
 * Lifetime requests and deliveries across marketplace chains, split into on-chain and
 * settled off-chain. Totals are rebuilt as on-chain + off-chain per chain, so they stay
 * correct where an indexer adds a signed delivery to the globals more than once.
 */
const fetchMechGlobals = async (): Promise<MetricWithStatus<MechGlobals | null>> => {
  const chains = MARKETPLACE_CHAIN_KEYS;

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      requestMarketplace(chain, {
        subgraph: mechMarketplaceTotalRequestsQuery,
        squid: mechMarketplaceTotalRequestsSquidQuery,
      })
    );
    const blockPromises = chains.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    let onChainRequests = 0;
    let onChainDeliveries = 0;
    let offChainRequests = 0;

    await Promise.all(
      chains.map(async (chain, index) => {
        const queryResult = results[index];
        const blockResult = results[index + chains.length];
        const source = `marketplace:${chain}`;

        if (queryResult.status === 'rejected') {
          console.error(source, queryResult.reason);
          fetchErrors.push(source);
          return;
        }
        const data = queryResult.value as MechGlobalsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(source);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(source);
        }

        let split: ChainRequestSplit | null;
        try {
          split = await fetchChainRequestSplit(chain, data, source, fetchErrors);
        } catch (error) {
          console.error(`${source}:offchain`, error);
          fetchErrors.push(`${source}:offchain`);
          return;
        }
        if (split === null) return;

        onChainRequests += split.onChainRequests;
        onChainDeliveries += split.onChainDeliveries;
        offChainRequests += split.offChain;
      })
    );

    return {
      value: {
        requests: onChainRequests + offChainRequests,
        deliveries: onChainDeliveries + offChainRequests,
        onChainRequests,
        offChainRequests,
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching marketplace globals from subgraphs:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus(
        chains.map((chain) => `marketplace:${chain}`).join(', ')
      ),
    };
  }
};

type AgentPerformance = WithMeta<{
  agentPerformances: {
    txCount: number;
    agentId: string;
  }[];
}>;

// Fetch agents.fun txCount from Base registry subgraph
const fetchAgentsFunTxCount = async (): Promise<MetricWithStatus<number | null>> => {
  const indexingErrors = [];
  const laggingSubgraphs = [];

  try {
    const agentIds = MECH_AGENT_CLASSIFICATION.agentsfun;
    const [result, block] = await Promise.all([
      REGISTRY_GRAPH_CLIENTS.base.request(agentTxCountsQuery, {
        agentIds,
      }) as Promise<AgentPerformance>,
      getChainBlockNumber('base'),
    ]);

    if (result?._meta?.hasIndexingErrors) {
      indexingErrors.push('registry:base');
    }
    if (checkSubgraphLag(block, result?._meta?.block?.number, 'base')) {
      laggingSubgraphs.push('registry:base');
    }

    const rows = result?.agentPerformances || [];
    const txCount = rows.reduce((sum, row) => sum + Number(row?.txCount ?? 0), 0);
    return {
      value: txCount,
      status: createStaleStatus({
        indexingErrors,
        fetchErrors: [],
        laggingSubgraphs,
      }),
    };
  } catch (error) {
    console.error('Error fetching agents.fun txCount:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('registry:base'),
    };
  }
};

type MarketplaceRequestsPerAgentsResult = WithMeta<{
  requestsPerAgents: { id: string; requestsCount: number }[];
  requestsPerAgentOnchains: { id: string; requestsCount: number }[];
}>;

// Classified totals derived from subgraphs (Marketplace)
const fetchCategorizedRequestTotals = async (): Promise<
  MetricWithStatus<{
    predictTxs: number;
    contributeTxs: number;
    governatooorrTxs: number;
  } | null>
> => {
  // Subgraph chains only: the agent ids are classified per chain and the squids have no
  // `requestsPerAgentOnchains`.
  const allClients = MARKETPLACE_GRAPH_CLIENTS;
  const chains = Object.keys(allClients);

  const predictTraderIds = MECH_AGENT_CLASSIFICATION.predict;
  const contributeIds = MECH_AGENT_CLASSIFICATION.contribute;
  const governatooorIds = MECH_AGENT_CLASSIFICATION.governatooor;
  const allIds = [...predictTraderIds, ...contributeIds, ...governatooorIds];

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      allClients[chain].request(mechMarketplaceRequestsPerAgentsQuery(allIds.map(String)))
    );
    const blockPromises = chains.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const combinedCounts = new Map();

    const addCounts = (records: { id: string; requestsCount: number }[] | undefined) => {
      if (!Array.isArray(records)) return;
      records.forEach((item) => {
        if (!item?.id) return;
        const agentId = Number(item.id);
        if (!Number.isFinite(agentId)) return;
        const requestCount = Number(item?.requestsCount ?? 0);
        combinedCounts.set(agentId, (combinedCounts.get(agentId) ?? 0) + requestCount);
      });
    };

    chains.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + chains.length];

      if (queryResult.status === 'rejected') {
        console.error(`marketplace:${chain}`, queryResult.reason);
        fetchErrors.push(`marketplace:${chain}`);
      } else {
        const data = queryResult.value as MarketplaceRequestsPerAgentsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`marketplace:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`marketplace:${chain}`);
        }

        addCounts(data.requestsPerAgents);
        addCounts(data.requestsPerAgentOnchains);
      }
    });

    const sumCountsForAgentIds = (agentIds: number[]) =>
      agentIds.reduce((accumulator, id) => accumulator + (combinedCounts.get(id) ?? 0), 0);

    return {
      value: {
        predictTxs: sumCountsForAgentIds(predictTraderIds),
        contributeTxs: sumCountsForAgentIds(contributeIds),
        governatooorrTxs: sumCountsForAgentIds(governatooorIds),
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching categorized marketplace requests:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus(
        chains.map((chain) => `marketplace:${chain}`).join(', ')
      ),
    };
  }
};

export const fetchMechMetrics = async () => {
  try {
    const [dailyActiveAgents, globals, categorized, agentsfunTxs] = await Promise.all([
      fetchDailyAgentPerformance(),
      fetchMechGlobals(),
      fetchCategorizedRequestTotals(),
      fetchAgentsFunTxCount(),
    ]);

    const predictTxsValue = categorized.value?.predictTxs ?? 0;
    const contributeTxsValue = categorized.value?.contributeTxs ?? 0;
    const governatooorrTxsValue = categorized.value?.governatooorrTxs ?? 0;
    const agentsfunTxsValue = agentsfunTxs.value ?? 0;
    const totalRequestsValue = globals.value?.requests ?? 0;

    const known = predictTxsValue + contributeTxsValue + governatooorrTxsValue + agentsfunTxsValue;
    const otherTxsValue = Math.max(0, totalRequestsValue - known);

    return {
      dailyActiveAgents: dailyActiveAgents,
      totalRequests: {
        value: globals.value?.requests ?? null,
        status: globals.status,
      },
      totalDeliveries: {
        value: globals.value?.deliveries ?? null,
        status: globals.status,
      },
      onChainRequests: {
        value: globals.value?.onChainRequests ?? null,
        status: globals.status,
      },
      offChainRequests: {
        value: globals.value?.offChainRequests ?? null,
        status: globals.status,
      },
      predictTxs: {
        value: categorized.value ? predictTxsValue : null,
        status: categorized.status,
      },
      contributeTxs: {
        value: categorized.value ? contributeTxsValue : null,
        status: categorized.status,
      },
      governatooorrTxs: {
        value: categorized.value ? governatooorrTxsValue : null,
        status: categorized.status,
      },
      agentsfunTxs: agentsfunTxs,
      // `other` is derived as total - known, so a failure in ANY of its three inputs
      // inflates it. agentsfunTxs was previously excluded from both the value gate and the
      // status merge: a failed agents.fun subgraph nulled to 0, shrank `known`, and
      // published an inflated bucket as healthy — straight past hasHardError and over the
      // last good blob. All three inputs now gate the value and contribute their status.
      otherTxs: {
        value:
          globals.value && categorized.value && agentsfunTxs.value != null ? otherTxsValue : null,
        status: createStaleStatus({
          indexingErrors: [
            ...(globals.status.indexingErrors || []),
            ...(categorized.status.indexingErrors || []),
            ...(agentsfunTxs.status.indexingErrors || []),
          ],
          fetchErrors: [
            ...(globals.status.fetchErrors || []),
            ...(categorized.status.fetchErrors || []),
            ...(agentsfunTxs.status.fetchErrors || []),
          ],
          laggingSubgraphs: [
            ...(globals.status.laggingSubgraphs || []),
            ...(categorized.status.laggingSubgraphs || []),
            ...(agentsfunTxs.status.laggingSubgraphs || []),
          ],
        }),
      },
    };
  } catch (error) {
    console.error('Error fetching all marketplace metrics:', error);
    const errorStatus = getFetchErrorAndCreateStaleStatus('marketplace:all');
    const errorMetric = { value: null, status: errorStatus };
    return {
      dailyActiveAgents: errorMetric,
      totalRequests: errorMetric,
      totalDeliveries: errorMetric,
      onChainRequests: errorMetric,
      offChainRequests: errorMetric,
      predictTxs: errorMetric,
      contributeTxs: errorMetric,
      governatooorrTxs: errorMetric,
      agentsfunTxs: errorMetric,
      otherTxs: errorMetric,
    };
  }
};
