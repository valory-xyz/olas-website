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

const getPredictPerformances = async () => {
  const traderAgentIds = PREDICT_AGENT_CLASSIFICATION.valory_trader;

  // Fetch last 7 complete days: gt 8 days ago, lt today
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  try {
    const performance = await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      dailyPredictAgentPerformancesWithMultisigsQuery,
      {
        agentId_in: traderAgentIds,
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

const filterPearlPerformances = (performances, pearlServiceIds) => {
  return performances.map((perf) => {
    const pearlMultisigs = perf.multisigs.filter((m) =>
      pearlServiceIds.has(Number(m.multisig.serviceId)),
    );
    return {
      ...perf,
      activeMultisigCount: new Set(pearlMultisigs.map((m) => m.multisig.id))
        .size,
    };
  });
};

const getBabydegenPerformances = async () => {
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

    return result.dailyAgentPerformances ?? [];
  } catch (error) {
    console.error('Error fetching Optimism DAAs:', error);
    return [];
  }
};

const getPearlServiceIds = async () => {
  const predictStakingContracts = Object.values(PREDICT_STAKING_PROGRAMS_PEARL);

  const checkpoints = await STAKING_GRAPH_CLIENTS.gnosis.request(
    checkpointsQuery,
    {
      contractAddress_in: predictStakingContracts,
      blockTimestamp_lte: Math.floor(Date.now() / 1000),
    },
  );

  const contractsToServiceId = getContractsToServiceId(
    checkpoints?.checkpoints ?? [],
  );
  return new Set(Object.keys(contractsToServiceId).map(Number));
};

const combineDailyCounts = (predictPerformances, babydegenPerformances) => {
  const dailyCountsMap = {};

  predictPerformances.forEach((perf) => {
    const timestamp = perf.dayTimestamp;
    dailyCountsMap[timestamp] = {
      count: (dailyCountsMap[timestamp]?.count || 0) + perf.activeMultisigCount,
    };
  });

  babydegenPerformances.forEach((perf) => {
    const timestamp = perf.dayTimestamp;
    dailyCountsMap[timestamp] = {
      count: (dailyCountsMap[timestamp]?.count || 0) + perf.activeMultisigCount,
    };
  });

  return Object.values(dailyCountsMap);
};

const getCombinedPearlDAAs = async () => {
  const [pearlServiceIdsResult, predictResult, babydegenResult] =
    await Promise.allSettled([
      getPearlServiceIds(),
      getPredictPerformances(),
      getBabydegenPerformances(),
    ]);

  const pearlServiceIds =
    pearlServiceIdsResult.status === 'fulfilled'
      ? pearlServiceIdsResult.value
      : new Set();
  const predictPerformances =
    predictResult.status === 'fulfilled' ? predictResult.value : [];
  const babydegenPerformances =
    babydegenResult.status === 'fulfilled' ? babydegenResult.value : [];

  const filteredPredictPerformances = filterPearlPerformances(
    predictPerformances,
    pearlServiceIds,
  );

  const combinedDailyCounts = combineDailyCounts(
    filteredPredictPerformances,
    babydegenPerformances,
  );

  const averageDAAs = calculate7DayAverage(combinedDailyCounts, 'count');

  return Math.floor(averageDAAs);
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
    const dailyActiveAgents = await getCombinedPearlDAAs();

    return res.status(200).json({
      dailyActiveAgents,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching Pearl DAAs:', error);
    return res.status(500).json({ error: 'Failed to fetch Pearl DAAs.' });
  }
}
