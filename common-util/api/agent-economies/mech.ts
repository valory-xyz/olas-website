import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { MECH_AGENT_CLASSIFICATION } from 'common-util/constants';
import {
  ATA_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyMechAgentPerformancesQuery,
  mechGlobalsTotalRequestsQuery,
  mechMarketplaceRequestsPerAgentsQuery,
  mechMarketplaceTotalRequestsQuery,
  mechRequestsPerAgentOnchainsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { extractSettledNumber } from 'common-util/promises';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type GnosisResult = {
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
};

type BaseResult = {
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
};

const fetchDailyAgentPerformance = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const [gnosisResult, baseResult] = await Promise.allSettled([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }) as Promise<GnosisResult>,
      REGISTRY_GRAPH_CLIENTS.base.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }) as Promise<BaseResult>,
    ]);

    const handleResult = <T>(
      result: PromiseSettledResult<T>,
      source: string,
    ) => {
      if (result.status === 'rejected') {
        fetchErrors.push(`registry:${source}`);
        return null;
      }
      return result.value;
    };

    const gnosisData = handleResult(gnosisResult, 'gnosis');
    const baseData = handleResult(baseResult, 'base');
    const gnosisPerformances = gnosisData?.dailyAgentPerformances ?? [];
    const basePerformances = baseData?.dailyAgentPerformances ?? [];

    const gnosisAverage = calculate7DayAverage(
      gnosisPerformances,
      'activeMultisigCount',
    );
    const baseAverage = calculate7DayAverage(
      basePerformances,
      'activeMultisigCount',
    );

    return {
      value: gnosisAverage + baseAverage,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching mech daily agent performances:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:gnosis', 'registry:base']),
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
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = (await Promise.allSettled([
      ATA_GRAPH_CLIENTS.legacyMech.request(mechGlobalsTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.gnosis.request(mechMarketplaceTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.base.request(mechMarketplaceTotalRequestsQuery),
    ])) as PromiseSettledResult<MechGlobalsResult>[];

    const sources = ['legacyMech', 'gnosis', 'base'];
    results.forEach((res, index) => {
      const source = sources[index];
      if (res.status === 'rejected') {
        fetchErrors.push(`mech:${source}`);
      } else if (res.value?._meta?.hasIndexingErrors) {
        indexingErrors.push(`mech:${source}`);
      }
    });

    const totals = results.reduce(
      (acc, res) => {
        acc.requests += extractSettledNumber(res, 'global.totalRequests');
        acc.deliveries += extractSettledNumber(res, 'global.totalDeliveries');
        return acc;
      },
      { requests: 0, deliveries: 0 },
    );

    return {
      value: totals,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
    return {
      value: null,
      status: createStaleStatus([], ['mech:all']),
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
const fetchAgentsFunTxCount = async (): Promise<
  MetricWithStatus<number | null>
> => {
  try {
    const agentIds = MECH_AGENT_CLASSIFICATION.agentsfun;
    const result: AgentPerformance = await REGISTRY_GRAPH_CLIENTS.base.request(
      agentTxCountsQuery,
      {
        agentIds,
      },
    );
    const rows = result?.agentPerformances || [];
    const txCount = rows.reduce(
      (sum, row) => sum + Number(row?.txCount ?? 0),
      0,
    );
    return {
      value: txCount,
      status: createStaleStatus(
        result?._meta?.hasIndexingErrors ? ['registry:base'] : [],
        [],
      ),
    };
  } catch (error) {
    console.error('Error fetching agents.fun txCount:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:base']),
    };
  }
};

type MechResult = WithMeta<{
  requestsPerAgentOnchains: { id: string; requestsCount: number }[];
  requestsPerAgents: { id: string; requestsCount: number }[];
}>;

type MarketplaceGnosisResult = WithMeta<{
  requestsPerAgents: { id: string; requestsCount: number }[];
}>;

type MarketplaceBaseResult = WithMeta<{
  requestsPerAgents: { id: string; requestsCount: number }[];
}>;

// Classified totals derived from subgraphs (Mech + Mech-Marketplace Gnosis + Base)
const fetchCategorizedRequestTotals = async (): Promise<
  MetricWithStatus<{
    predictTxs: number;
    contributeTxs: number;
    governatooorrTxs: number;
  } | null>
> => {
  const predictTraderIds = MECH_AGENT_CLASSIFICATION.predict;
  const contributeIds = MECH_AGENT_CLASSIFICATION.contribute;
  const governatooorIds = MECH_AGENT_CLASSIFICATION.governatooor;
  const allIds = [...predictTraderIds, ...contributeIds, ...governatooorIds];
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const [mechResult, marketplaceGnosisResult, marketplaceBaseResult] =
      (await Promise.allSettled([
        ATA_GRAPH_CLIENTS.legacyMech.request(
          mechRequestsPerAgentOnchainsQuery(allIds.map(String)),
        ),
        ATA_GRAPH_CLIENTS.gnosis.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String)),
        ),
        ATA_GRAPH_CLIENTS.base.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String)),
        ),
      ])) as [
        PromiseSettledResult<MechResult>,
        PromiseSettledResult<MarketplaceGnosisResult>,
        PromiseSettledResult<MarketplaceBaseResult>,
      ];

    const results = [
      mechResult,
      marketplaceGnosisResult,
      marketplaceBaseResult,
    ];
    const sources = ['legacyMech', 'gnosis', 'base'];
    results.forEach((res, index) => {
      const source = sources[index];
      if (res.status === 'rejected') {
        fetchErrors.push(`mech:${source}`);
      } else {
        if (res.value?._meta?.hasIndexingErrors) {
          indexingErrors.push(`mech:${source}`);
        }
      }
    });

    const combinedCounts = new Map();

    const addCounts = (
      records: { id: string; requestsCount: number }[] | undefined,
    ) => {
      if (!Array.isArray(records)) return;
      records.forEach((item) => {
        if (!item?.id) return;
        const agentId = Number(item.id);
        if (!Number.isFinite(agentId)) return;
        const requestCount = Number(item?.requestsCount ?? 0);
        combinedCounts.set(
          agentId,
          (combinedCounts.get(agentId) ?? 0) + requestCount,
        );
      });
    };

    if (mechResult.status === 'fulfilled') {
      addCounts(mechResult.value?.requestsPerAgentOnchains);
    }
    if (marketplaceGnosisResult.status === 'fulfilled') {
      addCounts(marketplaceGnosisResult.value?.requestsPerAgents);
    }
    if (marketplaceBaseResult.status === 'fulfilled') {
      addCounts(marketplaceBaseResult.value?.requestsPerAgents);
    }

    const sumCountsForAgentIds = (agentIds: number[]) =>
      agentIds.reduce(
        (accumulator, id) => accumulator + (combinedCounts.get(id) ?? 0),
        0,
      );

    return {
      value: {
        predictTxs: sumCountsForAgentIds(predictTraderIds),
        contributeTxs: sumCountsForAgentIds(contributeIds),
        governatooorrTxs: sumCountsForAgentIds(governatooorIds),
      },
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching categorized mech requests:', error);
    return {
      value: null,
      status: createStaleStatus([], ['mech:all']),
    };
  }
};

export const fetchMechMetrics = async () => {
  try {
    const [dailyActiveAgents, globals, categorized, agentsfunTxs] =
      await Promise.all([
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

    const known =
      predictTxsValue +
      contributeTxsValue +
      governatooorrTxsValue +
      agentsfunTxsValue;
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
        status: createStaleStatus(
          [
            ...(globals.status.indexingErrors || []),
            ...(categorized.status.indexingErrors || []),
          ],
          [
            ...(globals.status.fetchErrors || []),
            ...(categorized.status.fetchErrors || []),
          ],
        ),
      },
    };
  } catch (error) {
    console.error('Error fetching all mech metrics:', error);
    const errorStatus = createStaleStatus([], ['mech:all']);
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
