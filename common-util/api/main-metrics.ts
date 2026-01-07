import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  ATA_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
  MECH_FEES_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  ataTransactionsQuery,
  dailyAgentPerformancesQuery,
  legacyMechFeesQuery,
  newMechFeesQuery,
  operatorGlobalsQuery,
  registryGlobalsQuery,
  stakingGlobalsQuery,
} from 'common-util/graphql/queries';
import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformancesResult = {
  dailyActiveMultisigs_collection: {
    id: string;
    count: number;
  }[];
};

const fetchDailyAgentPerformance = async (): Promise<number | null> => {
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
      .map(
        (result) =>
          (result as PromiseFulfilledResult<DailyAgentPerformancesResult>).value
            .dailyActiveMultisigs_collection ?? []
      );

    const totalAverage = performanceByChains.reduce(
      (sum, performanceByChain) =>
        sum + calculate7DayAverage(performanceByChain, 'count'),
      0
    );

    return Math.floor(totalAverage);
  } catch (error) {
    console.error('Error fetching daily agent performances:', error);
    return null;
  }
};

type StakingGlobalsResult = {
  global: {
    currentOlasStaked: string;
  };
};

const fetchTotalOlasStaked = async (): Promise<string | null> => {
  try {
    const results = await Promise.allSettled([
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.base.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.mode.request(stakingGlobalsQuery),
      STAKING_GRAPH_CLIENTS.optimism.request(stakingGlobalsQuery),
    ]);

    const olasStakedByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result) =>
          (result as PromiseFulfilledResult<StakingGlobalsResult>).value.global
            ?.currentOlasStaked ?? '0'
      );

    const olasStaked = olasStakedByChains.reduce(
      (sum, olasStakedByChain) => sum + BigInt(olasStakedByChain),
      BigInt(0)
    );

    return formatWeiNumber(`${olasStaked}`, {
      notation: 'standard',
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error('Error fetching OLAS staked:', error);
    return null;
  }
};

type RegistryGlobalsResult = {
  global: {
    txCount: string;
  };
};

const fetchTransactions = async (): Promise<string | null> => {
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
      .map(
        (result) =>
          (result as PromiseFulfilledResult<RegistryGlobalsResult>).value.global
            ?.txCount ?? '0'
      );

    const transactions = txCountByChains.reduce(
      (sum, txCountByChain) => sum + BigInt(txCountByChain),
      BigInt(0)
    );

    return formatEthNumber(`${transactions}`, {
      notation: 'standard',
      maximumFractionDigits: 0,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return null;
  }
};

type OperatorGlobalsResult = {
  globals: {
    totalOperators: number;
  }[];
};

const fetchTotalOperators = async (): Promise<number | null> => {
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
      .map(
        (result) =>
          (result as PromiseFulfilledResult<OperatorGlobalsResult>).value
            .globals?.[0]?.totalOperators ?? 0
      );

    const totalOperators = operatorsByChains.reduce(
      (sum, operatorsByChain) => sum + operatorsByChain,
      0
    );

    return totalOperators;
  } catch (error) {
    console.error('Error fetching total operators:', error);
    return null;
  }
};

type AtaTransactionsResult = {
  globals: {
    totalAtaTransactions: string;
  }[];
};

export const fetchAtaTransactions = async () => {
  try {
    const results = await Promise.allSettled([
      ATA_GRAPH_CLIENTS.gnosis.request(ataTransactionsQuery),
      ATA_GRAPH_CLIENTS.base.request(ataTransactionsQuery),
      ATA_GRAPH_CLIENTS.legacyMech.request(ataTransactionsQuery),
    ]);

    const ataTransactionsByChains = results
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result) =>
          (result as PromiseFulfilledResult<AtaTransactionsResult>).value
            ?.globals?.[0]?.totalAtaTransactions || '0'
      );

    return ataTransactionsByChains
      .reduce((sum, ataTxByChain) => sum + BigInt(ataTxByChain), BigInt(0))
      .toString();
  } catch (error) {
    console.error('Error fetching ATA transactions:', error);
    return null;
  }
};

type MechFeesResult = {
  global: {
    totalFeesIn: string;
    totalFeesInUSD: string;
  };
};

type LegacyMechFeesResult = {
  global: {
    totalFeesIn: string;
  };
};

export const fetchMechFees = async () => {
  try {
    const results = (await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesQuery),
    ])) as [
      PromiseFulfilledResult<MechFeesResult>,
      PromiseFulfilledResult<MechFeesResult>,
      PromiseFulfilledResult<LegacyMechFeesResult>,
    ];

    let totalFees = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.global) {
        const feeValue = result.value.global;

        if (index === 2) {
          // Legacy mech fees (index 2) - convert from wei to XDAI
          const weiValue = feeValue.totalFeesIn || '0';
          const xdaiValue = Number(weiValue) / 10 ** 18;
          totalFees += xdaiValue;
        } else {
          // New mech fees (indices 0, 1) - already in USD
          const usdValue = Number(
            (feeValue as MechFeesResult['global']).totalFeesInUSD || '0'
          );
          totalFees += usdValue;
        }
      }
    });

    return totalFees.toFixed(2);
  } catch (error) {
    console.error('Error fetching mech fees:', error);
    return null;
  }
};

export const fetchAllAgentMetrics = async (): Promise<{
  data: {
    dailyActiveAgents: number | null;
    olasStaked: string | null;
    transactions: string | null;
    ataTransactions: string | null;
    mechFees: string | null;
    totalOperators: number | null;
  };
  timestamp: number;
} | null> => {
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
        dailyActiveAgentsResult.reason
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
      metrics.ataTransactions = ataTransactionsResult.value;
    } else {
      console.error(
        'Fetch ATA transactions failed:',
        ataTransactionsResult.reason
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
        totalOperatorsResult.reason
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
