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
  predictDailyAgentPerformancesQuery,
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
  const predictAgentIds = Object.values(PREDICT_AGENT_CLASSIFICATION)
    .flat()
    .map((n) => Number(n));

  // Fetch 14 days of data to ensure completeness (like reference implementation)
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(14);

  try {
    const performance = await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      predictDailyAgentPerformancesQuery,
      {
        agentId_in: predictAgentIds,
        dayTimestamp_gte: timestamp_gt,
        dayTimestamp_lte: timestamp_lt,
      },
    );

    return performance?.dailyAgentPerformances ?? [];
  } catch (error) {
    console.error('GraphQL query error:', error);
    return [];
  }
};

const groupServicesByDays = (activeServices, pearlServiceIds) => {
  const servicesByDays = {};

  for (const service of activeServices) {
    const date = new Date(Number(service.dayTimestamp) * 1000)
      .toISOString()
      .slice(0, 10);

    if (!servicesByDays[date]) {
      servicesByDays[date] = new Set();
    }

    for (const multisig of service.multisigs) {
      const serviceId = Number(multisig.multisig.serviceId);
      if (pearlServiceIds.has(serviceId)) {
        servicesByDays[date].add(multisig.multisig.id);
      }
    }
  }

  return servicesByDays;
};

const getOptimusDailyCounts = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

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
      // Extract timestamp from id: "day-{timestamp}-agent-40"
      const timestampMatch = perf.id.match(/day-(\d+)-agent-40/);
      if (!timestampMatch) {
        console.error('Invalid id format:', perf.id);
        return;
      }
      const timestamp = Number(timestampMatch[1]);
      const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
      dailyCounts[date] = Number(perf.activeMultisigCount);
    });
    return dailyCounts;
  } catch (error) {
    console.error('Error fetching Optimism DAAs:', error);
    return {};
  }
};

const calculate7DayTrailingAverage = (dailyCounts) => {
  if (dailyCounts.length < 7) {
    return 0;
  }

  const sum = dailyCounts.reduce((acc, count) => acc + count, 0);
  return sum / 7;
};

const getCombinedPearlDAAs = async () => {
  const [pearlDailyCounts, optimusDailyCounts] = await Promise.all([
    getPearlDailyCounts(),
    getOptimusDailyCounts(),
  ]);

  const allDates = new Set([
    ...Object.keys(pearlDailyCounts),
    ...Object.keys(optimusDailyCounts),
  ]);

  const sortedDates = Array.from(allDates).sort().slice(-7);

  const combinedCounts = {};
  const dailyCountsArray = [];

  sortedDates.forEach((date) => {
    const pearlCount = pearlDailyCounts[date] || 0;
    const optimusCount = optimusDailyCounts[date] || 0;
    const combined = pearlCount + optimusCount;
    combinedCounts[date] = {
      pearl: pearlCount,
      optimus: optimusCount,
      total: combined,
    };
    dailyCountsArray.push(combined);
  });

  const averageDAAs = calculate7DayTrailingAverage(dailyCountsArray);

  return {
    dailyActiveAgents: Math.floor(averageDAAs),
    dailyCounts: combinedCounts,
  };
};

const getPearlDailyCounts = async () => {
  const pearlStakingContracts = Object.values(PREDICT_STAKING_PROGRAMS_PEARL);

  const pearlCheckpoints = await STAKING_GRAPH_CLIENTS.gnosis.request(
    checkpointsQuery,
    {
      contractAddress_in: pearlStakingContracts,
      blockTimestamp_lte: Math.floor(Date.now() / 1000),
    },
  );

  const pearlContractsToServiceId = getContractsToServiceId(
    pearlCheckpoints?.checkpoints ?? [],
  );
  const pearlServiceIds = new Set(
    Object.keys(pearlContractsToServiceId).map(Number),
  );

  const activeServices = await getPerformanceByAgentId();
  const servicesByDays = groupServicesByDays(activeServices, pearlServiceIds);
  const dailyCounts = {};
  Object.keys(servicesByDays).forEach((date) => {
    dailyCounts[date] = servicesByDays[date].size;
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
