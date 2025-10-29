import { fetchAtaTransactions, fetchMechFees } from 'common-util/api/metrics';
import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  dailyAgentPerformancesQuery,
  operatorGlobalsQuery,
  registryGlobalsQuery,
  stakingGlobalsQuery,
} from 'common-util/graphql/queries';
import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  try {
    const results = await Promise.allSettled([
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

    const performanceByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value.dailyActiveMultisigs_collection ?? []);

    const totalAverage = performanceByChains.reduce(
      (sum, performanceByChain) =>
        sum + calculate7DayAverage(performanceByChain, 'count'),
      0,
    );

    return Math.floor(totalAverage);
  } catch (error) {
    console.error('Error fetching daily agent performances:', error);
    return null;
  }
};

const fetchTotalOlasStaked = async () => {
  try {
    const results = await Promise.allSettled([
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.base.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.mode.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.optimism.request(stakingGlobalsQuery),
    ]);

    const olasStakedByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value.global?.currentOlasStaked ?? '0');

    const olasStaked = olasStakedByChains.reduce(
      (sum, olasStakedByChain) => sum + BigInt(olasStakedByChain),
      BigInt(0),
    );

    return formatWeiNumber(`${olasStaked}`, { notation: 'standard' });
  } catch (error) {
    console.error('Error fetching OLAS staked:', error);
    return null;
  }
};

const fetchTransactions = async () => {
  try {
    const results = await Promise.allSettled([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.base.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.mode.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.optimism.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.celo.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.ethereum.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.polygon.request(registryGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.arbitrum.request(registryGlobalsQuery),
    ]);

    const txCountByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value.global?.txCount ?? '0');

    const transactions = txCountByChains.reduce(
      (sum, txCountByChain) => sum + BigInt(txCountByChain),
      BigInt(0),
    );

    return formatEthNumber(`${transactions}`, { notation: 'standard' });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }
};

const fetchTotalOperators = async () => {
  try {
    const results = await Promise.allSettled([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.base.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.mode.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.optimism.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.celo.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.ethereum.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.polygon.request(operatorGlobalsQuery),
      REGISTRY_GRAPH_CLIENTS.arbitrum.request(operatorGlobalsQuery),
    ]);

    const operatorsByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value.globals?.[0]?.totalOperators ?? 0);

    const totalOperators = operatorsByChains.reduce(
      (sum, operatorsByChain) => sum + operatorsByChain,
      0,
    );

    return totalOperators;
  } catch (error) {
    console.error('Error fetching total operators:', error);
    return null;
  }
};

const fetchAllAgentMetrics = async () => {
  try {
    const [
      dailyActiveAgentsResult,
      olasStakedResult,
      transactionsResult,
      ataTransactionsResult,
      mechFeesResult,
      totalOperatorsResult,
    ] = await Promise.allSettled([
      fetchDailyAgentPerformance(),
      fetchTotalOlasStaked(),
      fetchTransactions(),
      fetchAtaTransactions(),
      fetchMechFees(),
      fetchTotalOperators(),
    ]);

    const metrics = {
      dailyActiveAgents: null,
      olasStaked: null,
      transactions: null,
      ataTransactions: null,
      mechFees: null,
      totalOperators: null,
    };

    // Process the results from Promise.allSettled
    if (dailyActiveAgentsResult.status === 'fulfilled') {
      metrics.dailyActiveAgents = dailyActiveAgentsResult.value;
    } else {
      console.error(
        'Fetch daily active agents failed:',
        dailyActiveAgentsResult.reason,
      );
    }

    if (olasStakedResult.status === 'fulfilled') {
      metrics.olasStaked = olasStakedResult.value;
    } else {
      console.error('Fetch OLAS staked failed:', olasStakedResult.reason);
    }

    if (transactionsResult.status === 'fulfilled') {
      metrics.transactions = transactionsResult.value;
    } else {
      console.error('Fetch transactions failed:', transactionsResult.reason);
    }

    if (ataTransactionsResult.status === 'fulfilled') {
      metrics.ataTransactions = formatEthNumber(
        `${ataTransactionsResult.value}`,
        { notation: 'standard' },
      );
    } else {
      console.error(
        'Fetch ATA transactions failed:',
        ataTransactionsResult.reason,
      );
    }

    if (mechFeesResult.status === 'fulfilled') {
      metrics.mechFees = mechFeesResult.value;
    } else {
      console.error('Fetch mech fees failed:', mechFeesResult.reason);
    }

    if (totalOperatorsResult.status === 'fulfilled') {
      metrics.totalOperators = totalOperatorsResult.value;
    } else {
      console.error(
        'Fetch total operators failed:',
        totalOperatorsResult.reason,
      );
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
