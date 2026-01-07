import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { MECH_AGENT_CLASSIFICATION } from 'common-util/constants';
import {
  ATA_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  agentTxCountsQuery,
  dailyMechAgentPerformancesQuery,
  mechGlobalsTotalRequestsQuery,
  mechMarketplaceRequestsPerAgentsQuery,
  mechMarketplaceTotalRequestsQuery,
  mechRequestsPerAgentOnchainsQuery,
} from 'common-util/graphql/queries';
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

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0); // timestamp of today UTC midnight
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8); // timestamp of 8 days ago UTC midnight

  try {
    const [gnosisResult, baseResult] = await Promise.all([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }) as Promise<GnosisResult>,
      REGISTRY_GRAPH_CLIENTS.base.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }) as Promise<BaseResult>,
    ]);
    const gnosisPerformances = gnosisResult.dailyAgentPerformances ?? [];
    const basePerformances = baseResult.dailyAgentPerformances ?? [];

    const gnosisAverage = calculate7DayAverage(
      gnosisPerformances,
      'activeMultisigCount'
    );
    const baseAverage = calculate7DayAverage(
      basePerformances,
      'activeMultisigCount'
    );

    return gnosisAverage + baseAverage;
  } catch (error) {
    console.error('Error fetching mech daily agent performances:', error);
    return null;
  }
};

const fetchMechGlobals = async () => {
  try {
    const results = await Promise.allSettled([
      ATA_GRAPH_CLIENTS.legacyMech.request(mechGlobalsTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.gnosis.request(mechMarketplaceTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.base.request(mechMarketplaceTotalRequestsQuery),
    ]);

    const totals = results.reduce(
      (acc, res) => {
        acc.requests += extractSettledNumber(res, 'global.totalRequests');
        acc.deliveries += extractSettledNumber(res, 'global.totalDeliveries');
        return acc;
      },
      { requests: 0, deliveries: 0 }
    );

    return totals;
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
    return null;
  }
};

type AgentPerformance = {
  agentPerformances: {
    txCount: number;
  }[];
};

// Fetch agents.fun txCount from Base registry subgraph
const fetchAgentsFunTxCount = async () => {
  try {
    const agentIds = MECH_AGENT_CLASSIFICATION.agentsfun;
    const result: AgentPerformance = await REGISTRY_GRAPH_CLIENTS.base.request(
      agentTxCountsQuery,
      {
        agentIds,
      }
    );
    const rows = result?.agentPerformances || [];
    return rows.reduce((sum, row) => sum + Number(row?.txCount ?? 0), 0);
  } catch (error) {
    console.error('Error fetching agents.fun txCount:', error);
    return null;
  }
};

type MechResult = {
  requestsPerAgentOnchains: { id: string; requestsCount: number }[];
  requestsPerAgents: { id: string; requestsCount: number }[];
};

type MarketplaceGnosisResult = {
  requestsPerAgents: { id: string; requestsCount: number }[];
};

type MarketplaceBaseResult = {
  requestsPerAgents: { id: string; requestsCount: number }[];
};

// Classified totals derived from subgraphs (Mech + Mech-Marketplace Gnosis + Base)
const fetchCategorizedRequestTotals = async () => {
  const predictTraderIds = MECH_AGENT_CLASSIFICATION.predict;
  const contributeIds = MECH_AGENT_CLASSIFICATION.contribute;
  const governatooorIds = MECH_AGENT_CLASSIFICATION.governatooor;
  const allIds = [...predictTraderIds, ...contributeIds, ...governatooorIds];

  try {
    const [mechResult, marketplaceGnosisResult, marketplaceBaseResult] =
      (await Promise.allSettled([
        ATA_GRAPH_CLIENTS.legacyMech.request(
          mechRequestsPerAgentOnchainsQuery(allIds.map(String))
        ),
        ATA_GRAPH_CLIENTS.gnosis.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String))
        ),
        ATA_GRAPH_CLIENTS.base.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String))
        ),
      ])) as [
        PromiseSettledResult<MechResult>,
        PromiseSettledResult<MarketplaceGnosisResult>,
        PromiseSettledResult<MarketplaceBaseResult>,
      ];

    const combinedCounts = new Map();

    const addCounts = (
      records: { id: string; requestsCount: number }[] | undefined
    ) => {
      if (!Array.isArray(records)) return;
      records.forEach((item) => {
        if (!item?.id) return;
        const agentId = Number(item.id);
        if (!Number.isFinite(agentId)) return;
        const requestCount = Number(item?.requestsCount ?? 0);
        combinedCounts.set(
          agentId,
          (combinedCounts.get(agentId) ?? 0) + requestCount
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
        0
      );

    return {
      predictTxs: sumCountsForAgentIds(predictTraderIds),
      contributeTxs: sumCountsForAgentIds(contributeIds),
      governatooorrTxs: sumCountsForAgentIds(governatooorIds),
    };
  } catch (error) {
    console.error('Error fetching categorized mech requests:', error);
    return null;
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

    if (dailyActiveAgents !== null && globals !== null) {
      let typeTotals = {
        predictTxs: null,
        contributeTxs: null,
        governatooorrTxs: null,
        agentsfunTxs: null,
        otherTxs: null,
      };

      if (categorized) {
        const { predictTxs, contributeTxs, governatooorrTxs } = categorized;
        const known =
          predictTxs + contributeTxs + governatooorrTxs + (agentsfunTxs ?? 0);
        const otherTxs = Math.max(0, globals.requests - known);
        typeTotals = {
          predictTxs,
          contributeTxs,
          governatooorrTxs,
          agentsfunTxs,
          otherTxs,
        };
      }

      return {
        dailyActiveAgents,
        totalRequests: globals.requests,
        totalDeliveries: globals.deliveries,
        ...typeTotals,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching all mech metrics:', error);
    return null;
  }
};
