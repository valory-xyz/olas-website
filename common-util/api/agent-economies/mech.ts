import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { MECH_AGENT_CLASSIFICATION } from 'common-util/constants';
import { MARKETPLACE_GRAPH_CLIENTS, REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyMechAgentPerformancesQuery,
  mechMarketplaceRequestsPerAgentsQuery,
  mechMarketplaceTotalRequestsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

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
    console.error('Error fetching mech daily agent performances:', error);
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

const fetchMechGlobals = async (): Promise<
  MetricWithStatus<{ requests: number; deliveries: number } | null>
> => {
  const chains = Object.keys(MARKETPLACE_GRAPH_CLIENTS);

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      MARKETPLACE_GRAPH_CLIENTS[chain].request(mechMarketplaceTotalRequestsQuery)
    );
    const blockPromises = chains.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    let totalRequests = 0;
    let totalDeliveries = 0;

    chains.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + chains.length];

      if (queryResult.status === 'rejected') {
        console.error(`mech:${chain}`, queryResult.reason);
        fetchErrors.push(`mech:${chain}`);
      } else {
        const data = queryResult.value as MechGlobalsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`mech:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`mech:${chain}`);
        }

        totalRequests += Number(data.global?.totalRequests ?? 0);
        totalDeliveries += Number(data.global?.totalDeliveries ?? 0);
      }
    });

    return {
      value: { requests: totalRequests, deliveries: totalDeliveries },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus(chains.map((chain) => `mech:${chain}`).join(', ')),
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

// Classified totals derived from subgraphs (Mech + Mech-Marketplace)
const fetchCategorizedRequestTotals = async (): Promise<
  MetricWithStatus<{
    predictTxs: number;
    contributeTxs: number;
    governatooorrTxs: number;
  } | null>
> => {
  const chains = Object.keys(MARKETPLACE_GRAPH_CLIENTS);

  const predictTraderIds = MECH_AGENT_CLASSIFICATION.predict;
  const contributeIds = MECH_AGENT_CLASSIFICATION.contribute;
  const governatooorIds = MECH_AGENT_CLASSIFICATION.governatooor;
  const allIds = [...predictTraderIds, ...contributeIds, ...governatooorIds];

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      MARKETPLACE_GRAPH_CLIENTS[chain].request(
        mechMarketplaceRequestsPerAgentsQuery(allIds.map(String))
      )
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
        console.error(`mech:${chain}`, queryResult.reason);
        fetchErrors.push(`mech:${chain}`);
      } else {
        const data = queryResult.value as MarketplaceRequestsPerAgentsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`mech:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`mech:${chain}`);
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
    console.error('Error fetching categorized mech requests:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus(chains.map((chain) => `mech:${chain}`).join(', ')),
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
      otherTxs: {
        value: globals.value && categorized.value ? otherTxsValue : null,
        status: createStaleStatus({
          indexingErrors: [
            ...(globals.status.indexingErrors || []),
            ...(categorized.status.indexingErrors || []),
          ],
          fetchErrors: [
            ...(globals.status.fetchErrors || []),
            ...(categorized.status.fetchErrors || []),
          ],
          laggingSubgraphs: [
            ...(globals.status.laggingSubgraphs || []),
            ...(categorized.status.laggingSubgraphs || []),
          ],
        }),
      },
    };
  } catch (error) {
    console.error('Error fetching all mech metrics:', error);
    const errorStatus = getFetchErrorAndCreateStaleStatus('mech:all');
    const errorMetric = { value: null, status: errorStatus };
    return {
      dailyActiveAgents: errorMetric,
      totalRequests: errorMetric,
      totalDeliveries: errorMetric,
      predictTxs: errorMetric,
      contributeTxs: errorMetric,
      governatooorrTxs: errorMetric,
      agentsfunTxs: errorMetric,
      otherTxs: errorMetric,
    };
  }
};
