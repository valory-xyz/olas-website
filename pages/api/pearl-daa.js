import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  CACHE_DURATION_SECONDS,
  PREDICT_AGENT_CLASSIFICATION,
  PREDICT_STAKING_PROGRAMS_PEARL,
} from 'common-util/constants';
import {
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  checkpointsQuery,
  dailyBabydegenPerformancesQuery,
  dailyPredictAgentPerformancesWithMultisigsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const getContractsToServiceId = (checkpoints) => {
  return checkpoints.reduce((acc, checkpoint) => {
    checkpoint.serviceIds.forEach((serviceId) => {
      if (!acc[serviceId]) {
        acc[serviceId] = [];
      }
      acc[serviceId].push(checkpoint.contractAddress);
    });
    return acc;
  }, {});
};

const getPerformanceByAgentId = async () => {
  // Only use valory_trader agent IDs (14, 25)
  const traderAgentIds = PREDICT_AGENT_CLASSIFICATION.valory_trader;

  // Fetch last 7 complete days: gte 7 days ago, lte 1 day ago (yesterday)
  const timestamp_lte = getMidnightUtcTimestampDaysAgo(1); // Up to and including yesterday
  const timestamp_gte = getMidnightUtcTimestampDaysAgo(7); // From 7 days ago

  try {
    const performance = await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      dailyPredictAgentPerformancesWithMultisigsQuery,
      {
        agentId_in: traderAgentIds,
        dayTimestamp_gte: timestamp_gte,
        dayTimestamp_lte: timestamp_lte,
      },
    );

    return performance?.dailyAgentPerformances ?? [];
  } catch (error) {
    console.error('GraphQL query error:', error);
    return [];
  }
};

const groupServicesByDays = (activeServices, predictServiceIds) => {
  const servicesByDays = {};

  for (const service of activeServices) {
    const timestamp = service.dayTimestamp;

    if (!servicesByDays[timestamp]) {
      servicesByDays[timestamp] = new Set();
    }

    for (const multisig of service.multisigs) {
      const serviceId = Number(multisig.multisig.serviceId);
      if (predictServiceIds.has(serviceId)) {
        servicesByDays[timestamp].add(multisig.multisig.id);
      }
    }
  }

  return servicesByDays;
};

const getBabydegenOptimusDailyCounts = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(7);

  try {
    const result = await REGISTRY_GRAPH_CLIENTS.optimism.request(
      dailyBabydegenPerformancesQuery,
      {
        timestamp_gt,
        timestamp_lt,
      },
    );

    const performances = result.dailyAgentPerformances ?? [];
    const dailyCounts = {};

    performances.forEach((perf) => {
      const timestamp = perf.dayTimestamp;
      dailyCounts[timestamp] = perf.activeMultisigCount;
    });

    return dailyCounts;
  } catch (error) {
    console.error('Error fetching Optimism DAAs:', error);
    return {};
  }
};

const getCombinedPearlDAAs = async () => {
  const [predictResult, babydegenResult] = await Promise.allSettled([
    getPredictDailyCounts(),
    getBabydegenOptimusDailyCounts(),
  ]);

  const predictDailyCounts =
    predictResult.status === 'fulfilled' ? predictResult.value : {};
  const babydegenDailyCounts =
    babydegenResult.status === 'fulfilled' ? babydegenResult.value : {};

  const allTimestamps = new Set([
    ...Object.keys(predictDailyCounts),
    ...Object.keys(babydegenDailyCounts),
  ]);

  const sortedTimestamps = Array.from(allTimestamps).sort(
    (a, b) => Number(a) - Number(b),
  );

  const combinedCounts = {};
  const dailyCountsArray = [];

  sortedTimestamps.forEach((timestamp) => {
    const predictCount = predictDailyCounts[timestamp] || 0;
    const babydegenCount = babydegenDailyCounts[timestamp] || 0;
    const combined = predictCount + babydegenCount;

    // Convert to date string for output readability
    const dateString = new Date(Number(timestamp) * 1000)
      .toISOString()
      .slice(0, 10);

    combinedCounts[dateString] = {
      predict: predictCount,
      babydegen: babydegenCount,
      total: combined,
    };
    dailyCountsArray.push({ count: combined });
  });

  const averageDAAs = calculate7DayAverage(dailyCountsArray, 'count');

  return {
    dailyActiveAgents: Math.floor(averageDAAs),
    dailyCounts: combinedCounts,
  };
};

const getPredictDailyCounts = async () => {
  const predictStakingContracts = Object.values(PREDICT_STAKING_PROGRAMS_PEARL);

  const [checkpointsResult, performanceResult] = await Promise.allSettled([
    STAKING_GRAPH_CLIENTS.gnosis.request(checkpointsQuery, {
      contractAddress_in: predictStakingContracts,
      blockTimestamp_lte: Math.floor(Date.now() / 1000),
    }),
    getPerformanceByAgentId(),
  ]);

  const checkpoints =
    checkpointsResult.status === 'fulfilled' ? checkpointsResult.value : null;
  const activeServices =
    performanceResult.status === 'fulfilled' ? performanceResult.value : [];

  const predictContractsToServiceId = getContractsToServiceId(
    checkpoints?.checkpoints ?? [],
  );
  const predictServiceIds = new Set(
    Object.keys(predictContractsToServiceId).map(Number),
  );

  const servicesByDays = groupServicesByDays(activeServices, predictServiceIds);
  const dailyCounts = {};
  Object.keys(servicesByDays).forEach((timestamp) => {
    dailyCounts[timestamp] = servicesByDays[timestamp].size;
  });

  return dailyCounts;
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
    const combinedDAAs = await getCombinedPearlDAAs();

    const result = {
      dailyActiveAgents: combinedDAAs.dailyActiveAgents,
      dailyCounts: combinedDAAs.dailyCounts,
      timestamp: Date.now(),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching Pearl DAAs:', error);
    return res.status(500).json({ error: 'Failed to fetch Pearl DAAs.' });
  }
}
