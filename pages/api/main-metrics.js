import {
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  dailyAgentPerformancesQuery,
  registryGlobalsQuery,
  stakingGlobalsQuery,
} from 'common-util/graphql/queries';
import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const get7DaysPerformanceArray = (performanceArray) => {
  const resultArray = performanceArray ?? [];
  return [
    ...resultArray,
    ...Array(7 - resultArray.length).fill({ count: 0 }),
  ].slice(0, 7);
};

const get7DaysAverage = (array) => {
  const totalCount = array.reduce((sum, item) => sum + item.count, 0);
  return totalCount / 7;
};

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0); // timestamp of today UTC midnight
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8); // timestamp of 8 days ago UTC midnight

  try {
    const [gnosisResult, baseResult, modeResult, optimismResult] =
      await Promise.all([
        REGISTRY_GRAPH_CLIENTS.gnosis.request(dailyAgentPerformancesQuery, {
          timestamp_gt,
          timestamp_lt,
        }),
        REGISTRY_GRAPH_CLIENTS.base.request(dailyAgentPerformancesQuery, {
          timestamp_gt,
          timestamp_lt,
        }),
        REGISTRY_GRAPH_CLIENTS.mode.request(dailyAgentPerformancesQuery, {
          timestamp_gt,
          timestamp_lt,
        }),
        REGISTRY_GRAPH_CLIENTS.optimism.request(dailyAgentPerformancesQuery, {
          timestamp_gt,
          timestamp_lt,
        }),
      ]);

    const gnosisPerformances = get7DaysPerformanceArray(
      gnosisResult.dailyActiveMultisigs_collection,
    );
    const basePerformances = get7DaysPerformanceArray(
      baseResult.dailyActiveMultisigs_collection,
    );
    const modePerformances = get7DaysPerformanceArray(
      modeResult.dailyActiveMultisigs_collection,
    );
    const optimismPerformances = get7DaysPerformanceArray(
      optimismResult.dailyActiveMultisigs_collection,
    );

    const totalAverage =
      get7DaysAverage(gnosisPerformances) +
      get7DaysAverage(basePerformances) +
      get7DaysAverage(modePerformances) +
      get7DaysAverage(optimismPerformances);

    return Math.floor(totalAverage);
  } catch (error) {
    console.error('Error fetching daily agent performances:', error);
    return null;
  }
};

const fetchTotalOlasStaked = async () => {
  try {
    const [gnosisResult, baseResult, modeResult, optimismResult] =
      await Promise.all([
        STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
        STAKING_GRAPH_CLIENTS.base.request(stakingGlobalsQuery),
        STAKING_GRAPH_CLIENTS.mode.request(stakingGlobalsQuery),
        STAKING_GRAPH_CLIENTS.optimism.request(stakingGlobalsQuery),
      ]);

    const gnosisOlasStaked = gnosisResult.global?.currentOlasStaked ?? '0';
    const baseOlasStaked = baseResult.global?.currentOlasStaked ?? '0';
    const modeOlasStaked = modeResult.global?.currentOlasStaked ?? '0';
    const optimismOlasStaked = optimismResult.global?.currentOlasStaked ?? '0';

    const olasStaked =
      BigInt(gnosisOlasStaked) +
      BigInt(baseOlasStaked) +
      BigInt(modeOlasStaked) +
      BigInt(optimismOlasStaked);

    return formatWeiNumber(`${olasStaked}`, { notation: 'standard' });
  } catch (error) {
    console.error('Error fetching OLAS staked:', error);
    return null;
  }
};

const fetchTransactions = async () => {
  try {
    const [gnosisResult, baseResult, modeResult, optimismResult] =
      await Promise.all([
        REGISTRY_GRAPH_CLIENTS.gnosis.request(registryGlobalsQuery),
        REGISTRY_GRAPH_CLIENTS.base.request(registryGlobalsQuery),
        REGISTRY_GRAPH_CLIENTS.mode.request(registryGlobalsQuery),
        REGISTRY_GRAPH_CLIENTS.optimism.request(registryGlobalsQuery),
      ]);

    const gnosisTransactions = gnosisResult.global?.txCount ?? '0';
    const baseTransactions = baseResult.global?.txCount ?? '0';
    const modeTransactions = modeResult.global?.txCount ?? '0';
    const optimismTransactions = optimismResult.global?.txCount ?? '0';

    const transactions =
      BigInt(gnosisTransactions) +
      BigInt(baseTransactions) +
      BigInt(modeTransactions) +
      BigInt(optimismTransactions);

    return formatEthNumber(`${transactions}`, { notation: 'standard' });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }
};

const fetchAllAgentMetrics = async () => {
  try {
    const [dailyActiveAgentsResult, olasStakedResult, transactionsResult] =
      await Promise.allSettled([
        fetchDailyAgentPerformance(),
        fetchTotalOlasStaked(),
        fetchTransactions(),
      ]);

    const metrics = {
      dailyActiveAgents: null,
      olasStaked: null,
      transactions: null,
    };

    // Process the results from Promise.allSettled
    if (dailyActiveAgentsResult.status === 'fulfilled') {
      metrics.dailyActiveAgents = dailyActiveAgentsResult.value;
    } else {
      console.error('Fetch daily active agents failed:', roiResult.reason);
    }

    if (olasStakedResult.status === 'fulfilled') {
      metrics.olasStaked = olasStakedResult.value;
    } else {
      console.error('Fetch OLAS staked failed:', aprResult.reason);
    }

    if (transactionsResult.status === 'fulfilled') {
      metrics.transactions = transactionsResult.value;
    } else {
      console.error('Fetch transactions failed:', aprResult.reason);
    }

    const data = {
      data: metrics,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching main metrics:', error);
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
    const latestMetrics = await fetchAllAgentMetrics();
    if (latestMetrics) {
      return res.status(200).json(latestMetrics);
    }

    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch main metrics.' });
  }
}
