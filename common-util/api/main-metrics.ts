import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  ATA_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
  MECH_FEES_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import {
  ataTransactionsQuery,
  dailyAgentPerformancesQuery,
  legacyMechFeesQuery,
  newMechFeesQuery,
  operatorGlobalsQuery,
  registryGlobalsQuery,
  stakingGlobalsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformancesResult = WithMeta<{
  dailyActiveMultisigs_collection: {
    id: string;
    count: number;
  }[];
}>;

const fetchDailyAgentPerformance = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);
  const chains = ['gnosis', 'base', 'mode', 'optimism'] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled(
      chains.map((chain) =>
        REGISTRY_GRAPH_CLIENTS[chain].request(dailyAgentPerformancesQuery, {
          timestamp_gt,
          timestamp_lt,
        })
      )
    );

    const performanceByChains: DailyAgentPerformancesResult['dailyActiveMultisigs_collection'][] =
      [];

    results.forEach((result, index) => {
      const chain = chains[index];
      if (result.status === 'rejected') {
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = result.value as DailyAgentPerformancesResult;
        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        performanceByChains.push(data.dailyActiveMultisigs_collection ?? []);
      }
    });

    const totalAverage = performanceByChains.reduce(
      (sum, performanceByChain) =>
        sum + calculate7DayAverage(performanceByChain, 'count'),
      0
    );

    return {
      value: Math.floor(totalAverage),
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching daily agent performances:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:all']),
    };
  }
};

type StakingGlobalsResult = WithMeta<{
  global: {
    currentOlasStaked: string;
  };
}>;

const fetchTotalOlasStaked = async (): Promise<
  MetricWithStatus<string | null>
> => {
  const chains = ['gnosis', 'base', 'mode', 'optimism'] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled(
      chains.map((chain) => STAKING_GRAPH_CLIENTS[chain].request(stakingGlobalsQuery))
    );

    const olasStakedByChains: string[] = [];

    results.forEach((result, index) => {
      const chain = chains[index];
      if (result.status === 'rejected') {
        fetchErrors.push(`staking:${chain}`);
      } else {
        const data = result.value as StakingGlobalsResult;
        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`staking:${chain}`);
        }
        olasStakedByChains.push(data.global?.currentOlasStaked ?? '0');
      }
    });

    const olasStaked = olasStakedByChains.reduce(
      (sum, olasStakedByChain) => sum + BigInt(olasStakedByChain),
      BigInt(0)
    );

    return {
      value: formatWeiNumber(`${olasStaked}`, {
        notation: 'standard',
        maximumFractionDigits: 0,
      }),
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching OLAS staked:', error);
    return {
      value: null,
      status: createStaleStatus([], ['staking:all']),
    };
  }
};

type RegistryGlobalsResult = WithMeta<{
  global: {
    txCount: string;
  };
}>;

const fetchTransactions = async (): Promise<
  MetricWithStatus<string | null>
> => {
  const chains = [
    'gnosis',
    'base',
    'mode',
    'optimism',
    'celo',
    'ethereum',
    'polygon',
    'arbitrum',
  ] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled(
      chains.map((chain) => REGISTRY_GRAPH_CLIENTS[chain].request(registryGlobalsQuery))
    );

    const txCountByChains: string[] = [];

    results.forEach((result, index) => {
      const chain = chains[index];
      if (result.status === 'rejected') {
        console.error(result)
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = result.value as RegistryGlobalsResult;
        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        txCountByChains.push(data.global?.txCount ?? '0');
      }
    });

    const transactions = txCountByChains.reduce(
      (sum, txCountByChain) => sum + BigInt(txCountByChain),
      BigInt(0)
    );

    return {
      value: formatEthNumber(`${transactions}`, {
        notation: 'standard',
        maximumFractionDigits: 0,
      }),
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:all']),
    };
  }
};

type OperatorGlobalsResult = WithMeta<{
  globals: {
    totalOperators: number;
  }[];
}>;

const fetchTotalOperators = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const chains = [
    'gnosis',
    'base',
    'mode',
    'optimism',
    'celo',
    'ethereum',
    'polygon',
    'arbitrum',
  ] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled(
      chains.map((chain) => REGISTRY_GRAPH_CLIENTS[chain].request(operatorGlobalsQuery))
    );

    const operatorsByChains: number[] = [];

    results.forEach((result, index) => {
      const chain = chains[index];
      if (result.status === 'rejected') {
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = result.value as OperatorGlobalsResult;
        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        // TODO: Update operatorGlobalsQuery to use global(id: '') instead of globals array
        // to avoid needing to pick the first item
        operatorsByChains.push(data.globals?.[0]?.totalOperators ?? 0);
      }
    });

    const totalOperators = operatorsByChains.reduce(
      (sum, operatorsByChain) => sum + operatorsByChain,
      0
    );

    return {
      value: totalOperators,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching total operators:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:all']),
    };
  }
};

type AtaTransactionsResult = WithMeta<{
  globals: {
    totalAtaTransactions: string;
  }[];
}>;

export const fetchAtaTransactions = async (): Promise<
  MetricWithStatus<string | null>
> => {
  const sources = ['gnosis', 'base', 'legacyMech'] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled(
      sources.map((source) => ATA_GRAPH_CLIENTS[source].request(ataTransactionsQuery))
    );

    const ataTransactionsByChains: string[] = [];

    results.forEach((result, index) => {
      const source = sources[index];
      if (result.status === 'rejected') {
        fetchErrors.push(`ata:${source}`);
      } else {
        const data = result.value as AtaTransactionsResult;
        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`ata:${source}`);
        }
        ataTransactionsByChains.push(
          // TODO: Update ataTransactionsQuery to use global(id: '') instead of globals array
          // to avoid needing to pick the first item
          data.globals?.[0]?.totalAtaTransactions || '0'
        );
      }
    });

    const value = ataTransactionsByChains
      .reduce((sum, ataTxByChain) => sum + BigInt(ataTxByChain), BigInt(0))
      .toString();

    return {
      value,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching ATA transactions:', error);
    return {
      value: null,
      status: createStaleStatus([], ['ata:all']),
    };
  }
};

type MechFeesResult = WithMeta<{
  global: {
    totalFeesIn: string;
    totalFeesInUSD: string;
  };
}>;

type LegacyMechFeesResult = WithMeta<{
  global: {
    totalFeesIn: string;
  };
}>;

export const fetchMechFees = async (): Promise<
  MetricWithStatus<string | null>
> => {
  const sources = ['gnosis', 'base', 'legacy'] as const;
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const results = await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesQuery),
    ]);

    let totalFees = 0;

    results.forEach((result, index) => {
      const source = sources[index];
      if (result.status === 'rejected') {
        fetchErrors.push(`mechFees:${source}`);
      } else {
        const data =
          index === 2
            ? (result.value as LegacyMechFeesResult)
            : (result.value as MechFeesResult);

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`mechFees:${source}`);
        }

        if (data.global) {
          if (index === 2) {
            // Legacy mech fees (index 2) - convert from wei to XDAI
            const weiValue = data.global.totalFeesIn || '0';
            const xdaiValue = Number(weiValue) / 10 ** 18;
            totalFees += xdaiValue;
          } else {
            // New mech fees (indices 0, 1) - already in USD
            const usdValue = Number(
              (data.global as MechFeesResult['global']).totalFeesInUSD || '0'
            );
            totalFees += usdValue;
          }
        }
      }
    });

    return {
      value: totalFees.toFixed(2),
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching mech fees:', error);
    return {
      value: null,
      status: createStaleStatus([], ['mechFees:all']),
    };
  }
};

export type MainMetricsData = {
  dailyActiveAgents: MetricWithStatus<number | null>;
  olasStaked: MetricWithStatus<string | null>;
  transactions: MetricWithStatus<string | null>;
  ataTransactions: MetricWithStatus<string | null>;
  mechFees: MetricWithStatus<string | null>;
  totalOperators: MetricWithStatus<number | null>;
};

export type MainMetricsSnapshot = {
  data: MainMetricsData;
  timestamp: number;
};

export const fetchAllAgentMetrics =
  async (): Promise<MainMetricsSnapshot | null> => {
    try {
      const [
        dailyActiveAgentsResult,
        olasStakedResult,
        transactionsResult,
        ataTransactionsResult,
        mechFeesResult,
        totalOperatorsResult,
      ] = await Promise.all([
        fetchDailyAgentPerformance(),
        fetchTotalOlasStaked(),
        fetchTransactions(),
        fetchAtaTransactions(),
        fetchMechFees(),
        fetchTotalOperators(),
      ]);

      return {
        data: {
          dailyActiveAgents: dailyActiveAgentsResult,
          olasStaked: olasStakedResult,
          transactions: transactionsResult,
          ataTransactions: ataTransactionsResult,
          mechFees: mechFeesResult,
          totalOperators: totalOperatorsResult,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching main metrics:', error);
      return null;
    }
  };
