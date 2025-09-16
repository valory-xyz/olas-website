import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  ATA_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  dailyMechAgentPerformancesQuery,
  mechGlobalsTotalRequestsQuery,
  mechMarketplaceTotalRequestsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

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
    const [dailyActiveAgents, requests] = await Promise.all([
      fetchDailyAgentPerformance(),
      fetchMechRequestsFromSubgraphs(),
    ]);

    if (dailyActiveAgents !== null && requests !== null) {
      return res
        .status(200)
        .json({ dailyActiveAgents, totalRequests: requests });
    }

    return res.status(404).json({ error: 'Error fetching mech metrics.' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch mech metrics.' });
  }
}
