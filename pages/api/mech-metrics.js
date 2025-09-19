import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import {
  ATA_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  dailyMechAgentPerformancesQuery,
  mechGlobalsTotalRequestsQuery,
  mechMarketplaceRequestsPerAgentsQuery,
  mechMarketplaceTotalRequestsQuery,
  mechRequestsPerAgentOnchainsQuery,
} from 'common-util/graphql/queries';
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

    const gnosisPerformances = gnosisResult.dailyAgentPerformances ?? [];
    const basePerformances = baseResult.dailyAgentPerformances ?? [];

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

const fetchMechRequestsFromSubgraphs = async () => {
  try {
    const [legacyMechResult, marketplaceGnosisResult, marketplaceBaseResult] =
      await Promise.allSettled([
        ATA_GRAPH_CLIENTS.legacyMech.request(mechGlobalsTotalRequestsQuery),
        ATA_GRAPH_CLIENTS.gnosis.request(mechMarketplaceTotalRequestsQuery),
        ATA_GRAPH_CLIENTS.base.request(mechMarketplaceTotalRequestsQuery),
      ]);

    const legacyMechTotalRequests = (() => {
      if (legacyMechResult.status !== 'fulfilled') return 0;
      const response = legacyMechResult.value;
      return Number(response?.global?.totalRequests ?? 0);
    })();

    const marketplaceGnosisTotalRequests = (() => {
      if (marketplaceGnosisResult.status !== 'fulfilled') return 0;
      const response = marketplaceGnosisResult.value;
      return Number(response?.global?.totalRequests ?? 0);
    })();

    const marketplaceBaseTotalRequests = (() => {
      if (marketplaceBaseResult.status !== 'fulfilled') return 0;
      const response = marketplaceBaseResult.value;
      return Number(response?.global?.totalRequests ?? 0);
    })();

    return {
      mech: legacyMechTotalRequests,
      marketplace:
        marketplaceGnosisTotalRequests + marketplaceBaseTotalRequests,
      total:
        legacyMechTotalRequests +
        marketplaceGnosisTotalRequests +
        marketplaceBaseTotalRequests,
    };
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
    return null;
  }
};

// Classified totals derived from subgraphs (Mech + Mech-Marketplace Gnosis + Base)
const fetchCategorizedRequestTotals = async () => {
  // Agent IDs by category (from SQL classification)
  const predictTraderIds = [14, 25, 13];
  const contributeIds = [6];
  const governatooorIds = [5];
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

    const addCounts = (records, idFieldName, countFieldName) => {
      if (!Array.isArray(records)) return;
      records.forEach((item) => {
        const rawAgentId =
          item?.[idFieldName] !== undefined
            ? item?.[idFieldName]
            : (item?.agentId ?? item?.id);
        let agentId;
        if (typeof rawAgentId === 'number') {
          agentId = rawAgentId;
        } else if (typeof rawAgentId === 'string') {
          const match = rawAgentId.match(/\d+/);
          agentId = match ? Number(match[0]) : NaN;
        }
        if (!Number.isFinite(agentId)) return;
        const requestCount = Number(item?.[countFieldName] ?? 0);
        combinedCounts.set(
          agentId,
          (combinedCounts.get(agentId) ?? 0) + requestCount,
        );
      });
    };

    if (mechResult.status === 'fulfilled') {
      addCounts(
        mechResult.value?.requestsPerAgentOnchains,
        'id',
        'requestsCount',
      );
    }
    if (marketplaceGnosisResult.status === 'fulfilled') {
      addCounts(
        marketplaceGnosisResult.value?.requestsPerAgents,
        'id',
        'requestsCount',
      );
    }
    if (marketplaceBaseResult.status === 'fulfilled') {
      addCounts(
        marketplaceBaseResult.value?.requestsPerAgents,
        'id',
        'requestsCount',
      );
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
    const [dailyActiveAgents, requests, categorized] = await Promise.all([
      fetchDailyAgentPerformance(),
      fetchMechRequestsFromSubgraphs(),
      fetchCategorizedRequestTotals(),
    ]);

    if (dailyActiveAgents !== null && requests !== null) {
      let typeTotals = {
        predictTxs: null,
        contributeTxs: null,
        governatooorrTxs: null,
        otherTxs: null,
      };
      if (categorized) {
        const { predictTxs, contributeTxs, governatooorrTxs } = categorized;
        const known = predictTxs + contributeTxs + governatooorrTxs;
        const otherTxs = Math.max(0, Number(requests?.total ?? 0) - known);
        typeTotals = { predictTxs, contributeTxs, governatooorrTxs, otherTxs };
      }
      return res
        .status(200)
        .json({ dailyActiveAgents, totalRequests: requests, ...typeTotals });
    }

    return res.status(404).json({ error: 'Error fetching mech metrics.' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch mech metrics.' });
  }
}
