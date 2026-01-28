import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  legacyMechFeesGraphClient,
  MARKETPLACE_GRAPH_CLIENTS,
  MECH_FEES_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
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

const STAKING_CHAINS = ['gnosis', 'base', 'mode', 'optimism'] as const;
const ALL_REGISTRY_CHAINS = [
  'gnosis',
  'base',
  'mode',
  'optimism',
  'celo',
  'ethereum',
  'polygon',
  'arbitrum',
] as const;

type DailyAgentPerformancesResult = WithMeta<{
  dailyActiveMultisigs_collection: {
    id: string;
    count: number;
  }[];
}>;

const fetchDailyAgentPerformance = async (): Promise<MetricWithStatus<number | null>> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = STAKING_CHAINS.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(dailyAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      })
    );
    const blockPromises = STAKING_CHAINS.map((chain) =>
      getChainBlockNumber(chain)
    ) as Promise<number>[];
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const performanceByChains: DailyAgentPerformancesResult['dailyActiveMultisigs_collection'][] =
      [];

    STAKING_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + STAKING_CHAINS.length];

      if (queryResult.status === 'rejected') {
        console.error(`registry:${chain}`, queryResult.reason);
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = queryResult.value as DailyAgentPerformancesResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`registry:${chain}`);
        }
        performanceByChains.push(data.dailyActiveMultisigs_collection ?? []);
      }
    });

    const totalAverage = performanceByChains.reduce(
      (sum, performanceByChain) => sum + calculate7DayAverage(performanceByChain, 'count'),
      0
    );

    return {
      value: Math.floor(totalAverage),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching daily agent performances:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['registry:all'],
        laggingSubgraphs: ['registry:all'],
      }),
    };
  }
};

type StakingGlobalsResult = WithMeta<{
  global: {
    currentOlasStaked: string;
  };
}>;

const fetchTotalOlasStaked = async (): Promise<MetricWithStatus<string | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = STAKING_CHAINS.map((chain) =>
      STAKING_GRAPH_CLIENTS[chain].request(stakingGlobalsQuery)
    );
    const blockPromises = STAKING_CHAINS.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const olasStakedByChains: string[] = [];

    STAKING_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + STAKING_CHAINS.length];

      if (queryResult.status === 'rejected') {
        console.error(`staking:${chain}`, queryResult.reason);
        fetchErrors.push(`staking:${chain}`);
      } else {
        const data = queryResult.value as StakingGlobalsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`staking:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`staking:${chain}`);
        }
        olasStakedByChains.push(data.global?.currentOlasStaked ?? '0');
      }
    });

    const olasStaked = olasStakedByChains.reduce(
      (sum, olasStakedByChain) => sum + BigInt(olasStakedByChain),
      BigInt(0)
    );

    return {
      value: formatWeiNumber(olasStaked, {
        notation: 'standard',
        maximumFractionDigits: 0,
      }),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching OLAS staked:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['staking:all'],
        laggingSubgraphs: ['staking:all'],
      }),
    };
  }
};

type RegistryGlobalsResult = WithMeta<{
  global: {
    txCount: string;
  };
}>;

const fetchTransactions = async (): Promise<MetricWithStatus<string | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = ALL_REGISTRY_CHAINS.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(registryGlobalsQuery)
    );
    const blockPromises = ALL_REGISTRY_CHAINS.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const txCountByChains: string[] = [];

    ALL_REGISTRY_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + ALL_REGISTRY_CHAINS.length];

      if (queryResult.status === 'rejected') {
        console.error(`registry:${chain}`, queryResult.reason);
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = queryResult.value as RegistryGlobalsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`registry:${chain}`);
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
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['registry:all'],
        laggingSubgraphs: [],
      }),
    };
  }
};

type OperatorGlobalsResult = WithMeta<{
  globals: {
    totalOperators: number;
  }[];
}>;

const fetchTotalOperators = async (): Promise<MetricWithStatus<number | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = ALL_REGISTRY_CHAINS.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(operatorGlobalsQuery)
    );
    const blockPromises = ALL_REGISTRY_CHAINS.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const operatorsByChains: number[] = [];

    ALL_REGISTRY_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + ALL_REGISTRY_CHAINS.length];

      if (queryResult.status === 'rejected') {
        console.error(`registry:${chain}`, queryResult.reason);
        fetchErrors.push(`registry:${chain}`);
      } else {
        const data = queryResult.value as OperatorGlobalsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`registry:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`registry:${chain}`);
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
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching total operators:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['registry:all'],
        laggingSubgraphs: [],
      }),
    };
  }
};

type AtaTransactionsResult = WithMeta<{
  globals: {
    totalAtaTransactions: string;
  }[];
}>;

export const fetchAtaTransactions = async (): Promise<MetricWithStatus<string | null>> => {
  const sources = ['gnosis', 'base'] as const;

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = sources.map((source) =>
      MARKETPLACE_GRAPH_CLIENTS[source].request(ataTransactionsQuery)
    );
    const blockPromises = sources.map((source) => getChainBlockNumber(source));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const ataTransactionsByChains: string[] = [];

    sources.forEach((source, index) => {
      const queryResult = results[index];
      const blockResult = results[index + sources.length];

      if (queryResult.status === 'rejected') {
        console.error(`ata:${source}`, queryResult.reason);
        fetchErrors.push(`ata:${source}`);
      } else {
        const data = queryResult.value as AtaTransactionsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`ata:${source}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, source)) {
          laggingSubgraphs.push(`ata:${source}`);
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
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching ATA transactions:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['ata:all'],
        laggingSubgraphs: [],
      }),
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

export const fetchMechFees = async (): Promise<MetricWithStatus<string | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const [gnosisFeeResult, baseFeeResult, legacyFeeResult, gnosisBlockResult, baseBlockResult] =
      await Promise.allSettled([
        MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesQuery),
        MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesQuery),
        legacyMechFeesGraphClient.request(legacyMechFeesQuery),
        getChainBlockNumber('gnosis'),
        getChainBlockNumber('base'),
      ]);

    const gnosisBlock =
      gnosisBlockResult.status === 'fulfilled' ? (gnosisBlockResult.value as number) : null;
    const baseBlock =
      baseBlockResult.status === 'fulfilled' ? (baseBlockResult.value as number) : null;

    let totalFees = 0;

    const processResult = (
      result: PromiseSettledResult<MechFeesResult | LegacyMechFeesResult>,
      source: string,
      chainBlock: number | null
    ) => {
      const isLegacy = source === 'legacy';
      if (result.status === 'rejected') {
        console.error(`mechFees:${source}`, result.reason);
        fetchErrors.push(`mechFees:${source}`);
        return;
      }

      const data = isLegacy
        ? (result.value as LegacyMechFeesResult)
        : (result.value as MechFeesResult);

      if (data._meta?.hasIndexingErrors) {
        indexingErrors.push(`mechFees:${source}`);
      }
      if (checkSubgraphLag(chainBlock, data._meta?.block?.number, isLegacy ? 'gnosis' : source)) {
        laggingSubgraphs.push(`mechFees:${source}`);
      }

      if (data.global) {
        if (isLegacy) {
          // Legacy mech fees - convert from wei to XDAI
          const weiValue = (data as LegacyMechFeesResult).global.totalFeesIn || '0';
          const xdaiValue = Number(weiValue) / 10 ** 18;
          totalFees += xdaiValue;
        } else {
          // New mech fees (gnosis, base) - already in USD
          const usdValue = Number((data as MechFeesResult).global.totalFeesInUSD || '0');
          totalFees += usdValue;
        }
      }
    };

    processResult(
      gnosisFeeResult as unknown as PromiseSettledResult<MechFeesResult>,
      'gnosis',
      gnosisBlock
    );
    processResult(
      baseFeeResult as unknown as PromiseSettledResult<MechFeesResult>,
      'base',
      baseBlock
    );
    processResult(
      legacyFeeResult as unknown as PromiseSettledResult<LegacyMechFeesResult>,
      'legacy',
      gnosisBlock
    );

    return {
      value: totalFees.toFixed(2),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching mech fees:', error);
    return {
      value: null,
      status: createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['mechFees:all'],
        laggingSubgraphs: [],
      }),
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

export const fetchAllAgentMetrics = async (): Promise<MainMetricsSnapshot | null> => {
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
