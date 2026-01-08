import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  CACHE_DURATION_SECONDS,
  MECH_AGENT_CLASSIFICATION,
} from 'common-util/constants';
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

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0); // timestamp of today UTC midnight
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8); // timestamp of 8 days ago UTC midnight

  try {
    const [gnosisResult, baseResult] = await Promise.all([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
      REGISTRY_GRAPH_CLIENTS.base.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
    ]);

    const typedGnosisResult = gnosisResult as {
      dailyAgentPerformances?: unknown[];
    };
    const gnosisPerformances = typedGnosisResult.dailyAgentPerformances ?? [];

    const typedBaseResult = baseResult as {
      dailyAgentPerformances?: unknown[];
    };
    const basePerformances = typedBaseResult.dailyAgentPerformances ?? [];

    const gnosisAverage = calculate7DayAverage(
      gnosisPerformances,
      'activeMultisigCount',
    );
    const baseAverage = calculate7DayAverage(
      basePerformances,
      'activeMultisigCount',
    );

    const average = gnosisAverage + baseAverage;

    return average;
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
      { requests: 0, deliveries: 0 },
    );

    return totals;
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
    return null;
  }
};

// Fetch agents.fun txCount from Base registry subgraph
const fetchAgentsFunTxCount = async () => {
  try {
    const agentIds = MECH_AGENT_CLASSIFICATION.agentsfun;
    const result = await REGISTRY_GRAPH_CLIENTS.base.request(
      agentTxCountsQuery,
      {
        agentIds,
      },
    );

    const typedResult = result as {
      agentPerformances?: Array<{ id: string; txCount?: string | number }>;
    };
    const rows = typedResult.agentPerformances || [];
    return rows.reduce((sum, row) => sum + Number(row?.txCount ?? 0), 0);
  } catch (error) {
    console.error('Error fetching agents.fun txCount:', error);
    return null;
  }
};

// Classified totals derived from subgraphs (Mech + Mech-Marketplace Gnosis + Base)
const fetchCategorizedRequestTotals = async () => {
  const predictTraderIds = MECH_AGENT_CLASSIFICATION.predict;
  const contributeIds = MECH_AGENT_CLASSIFICATION.contribute;
  const governatooorIds = MECH_AGENT_CLASSIFICATION.governatooor;
  const allIds = [...predictTraderIds, ...contributeIds, ...governatooorIds];

  try {
    const [mechResult, marketplaceGnosisResult, marketplaceBaseResult] =
      await Promise.allSettled([
        ATA_GRAPH_CLIENTS.legacyMech.request(
          mechRequestsPerAgentOnchainsQuery(allIds.map(String)),
        ),
        ATA_GRAPH_CLIENTS.gnosis.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String)),
        ),
        ATA_GRAPH_CLIENTS.base.request(
          mechMarketplaceRequestsPerAgentsQuery(allIds.map(String)),
        ),
      ]);

    const combinedCounts = new Map();

    const addCounts = (records) => {
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
      const typedValue = mechResult.value as {
        requestsPerAgentOnchains?: Array<{ agentId: string; count: number }>;
      };
      addCounts(typedValue.requestsPerAgentOnchains);
    }
    if (marketplaceGnosisResult.status === 'fulfilled') {
      const typedValue = marketplaceGnosisResult.value as {
        requestsPerAgents?: Array<{ agentId: string; count: number }>;
      };
      addCounts(typedValue.requestsPerAgents);
    }
    if (marketplaceBaseResult.status === 'fulfilled') {
      const typedValue = marketplaceBaseResult.value as {
        requestsPerAgents?: Array<{ agentId: string; count: number }>;
      };
      addCounts(typedValue.requestsPerAgents);
    }

    const sumCountsForAgentIds = (agentIds) =>
      agentIds.reduce(
        (accumulator, id) => accumulator + (combinedCounts.get(id) ?? 0),
        0,
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
      return res.status(200).json({
        dailyActiveAgents,
        totalRequests: globals.requests,
        totalDeliveries: globals.deliveries,
        ...typeTotals,
      });
    }

    return res.status(404).json({ error: 'Error fetching mech metrics.' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch mech metrics.' });
  }
}
