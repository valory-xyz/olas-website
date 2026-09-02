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
  getFetchErrorAndCreateStaleStatus,
  readGlobalField,
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
import { fetchMechMarketplaceFees, MechFeesByToken } from 'common-util/api/mech-marketplace-fees';
import { formatEthNumber, formatWeiNumber } from 'common-util/numberFormatter';
import { formatUnits } from 'viem';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const STAKING_CHAINS = Object.keys(STAKING_GRAPH_CLIENTS);
const REGISTRY_CHAINS = Object.keys(REGISTRY_GRAPH_CLIENTS);

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
    const blockPromises = STAKING_CHAINS.map((chain) => getChainBlockNumber(chain));
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
        // An empty collection is legitimate (no activity); an absent field is not.
        if (data.dailyActiveMultisigs_collection == null) {
          console.error(`registry:${chain}: subgraph responded without dailyActiveMultisigs`);
          fetchErrors.push(`registry:${chain}:missingGlobal`);
        } else {
          performanceByChains.push(data.dailyActiveMultisigs_collection);
        }
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
      status: getFetchErrorAndCreateStaleStatus('registry:all'),
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
          blockResult.status === 'fulfilled' ? (blockResult.value as number | null) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`staking:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`staking:${chain}`);
        }
        // The query didn't fail, so a null Global just means no staking activity on this
        // chain yet — expected, chains are wired up ahead of launch.
        const currentOlasStaked = readGlobalField(
          data.global ?? { currentOlasStaked: '0' },
          'currentOlasStaked',
          `staking:${chain}`,
          fetchErrors
        );
        if (currentOlasStaked !== null) {
          olasStakedByChains.push(currentOlasStaked);
        }
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
      status: getFetchErrorAndCreateStaleStatus('staking:all'),
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
    const queryPromises = REGISTRY_CHAINS.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(registryGlobalsQuery)
    );
    const blockPromises = REGISTRY_CHAINS.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const txCountByChains: string[] = [];

    REGISTRY_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + REGISTRY_CHAINS.length];

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
        const txCount = readGlobalField(data.global, 'txCount', `registry:${chain}`, fetchErrors);
        if (txCount !== null) {
          txCountByChains.push(txCount);
        }
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
      status: getFetchErrorAndCreateStaleStatus('registry:all'),
    };
  }
};

type OperatorGlobalsResult = WithMeta<{
  global: {
    totalOperators: number;
  };
}>;

const fetchTotalOperators = async (): Promise<MetricWithStatus<number | null>> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = REGISTRY_CHAINS.map((chain) =>
      REGISTRY_GRAPH_CLIENTS[chain].request(operatorGlobalsQuery)
    );
    const blockPromises = REGISTRY_CHAINS.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const operatorsByChains: number[] = [];

    REGISTRY_CHAINS.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + REGISTRY_CHAINS.length];

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
        const totalOperators = readGlobalField(
          data.global,
          'totalOperators',
          `registry:${chain}`,
          fetchErrors
        );
        if (totalOperators !== null) {
          operatorsByChains.push(totalOperators);
        }
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
      status: getFetchErrorAndCreateStaleStatus('registry:all'),
    };
  }
};

type AtaTransactionsResult = WithMeta<{
  global: {
    totalAtaTransactions: string;
  };
}>;

export const fetchAtaTransactions = async (): Promise<MetricWithStatus<string | null>> => {
  const chains = Object.keys(MARKETPLACE_GRAPH_CLIENTS);

  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const queryPromises = chains.map((chain) =>
      MARKETPLACE_GRAPH_CLIENTS[chain].request(ataTransactionsQuery)
    );
    const blockPromises = chains.map((chain) => getChainBlockNumber(chain));
    const results = await Promise.allSettled([...queryPromises, ...blockPromises]);

    const ataTransactionsByChains: string[] = [];

    chains.forEach((chain, index) => {
      const queryResult = results[index];
      const blockResult = results[index + chains.length];

      if (queryResult.status === 'rejected') {
        console.error(`ata:${chain}`, queryResult.reason);
        fetchErrors.push(`ata:${chain}`);
      } else {
        const data = queryResult.value as AtaTransactionsResult;
        const chainBlock =
          blockResult.status === 'fulfilled' ? (blockResult.value as number) : null;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(`ata:${chain}`);
        }
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(`ata:${chain}`);
        }
        // The query didn't fail, so a null Global just means no ATA transactions on this
        // chain yet — expected, chains are wired up ahead of launch.
        const totalAtaTransactions = readGlobalField(
          data.global ?? { totalAtaTransactions: '0' },
          'totalAtaTransactions',
          `ata:${chain}`,
          fetchErrors
        );
        if (totalAtaTransactions !== null) {
          ataTransactionsByChains.push(totalAtaTransactions);
        }
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
      status: getFetchErrorAndCreateStaleStatus('ata:all'),
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
    // Every marketplace chain, matching agent-economies/mech-fees.ts. This used to query
    // gnosis + base only, so the homepage turnover and the mech page's Total Task Payments
    // were different aggregations that happened to agree while the other chains held no
    // fees — see PR #569 review.
    const chainKeys = Object.keys(MECH_FEES_GRAPH_CLIENTS) as Array<
      keyof typeof MECH_FEES_GRAPH_CLIENTS
    >;

    const [...settled] = await Promise.allSettled([
      ...chainKeys.map((chain) => MECH_FEES_GRAPH_CLIENTS[chain].request(newMechFeesQuery)),
      legacyMechFeesGraphClient.request(legacyMechFeesQuery),
      ...chainKeys.map((chain) => getChainBlockNumber(chain)),
    ]);

    const feeResults = settled.slice(0, chainKeys.length);
    const legacyFeeResult = settled[chainKeys.length];
    const blockResults = settled.slice(chainKeys.length + 1);

    const blockByChain = Object.fromEntries(
      chainKeys.map((chain, i) => [
        chain,
        blockResults[i]?.status === 'fulfilled'
          ? ((blockResults[i] as PromiseFulfilledResult<number | null>).value ?? null)
          : null,
      ])
    ) as Record<string, number | null>;

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

      // Split by branch only because a dynamically-chosen field name doesn't infer under
      // `keyof` against the union of the two global types.
      const raw = isLegacy
        ? readGlobalField(
            (data as LegacyMechFeesResult).global,
            'totalFeesIn',
            `mechFees:${source}`,
            fetchErrors
          )
        : readGlobalField(
            (data as MechFeesResult).global,
            'totalFeesInUSD',
            `mechFees:${source}`,
            fetchErrors
          );
      if (raw === null) return;

      // Legacy is wei-denominated. formatUnits (BigInt math) matches
      // agent-economies/mech-fees.ts: `Number(weiString) / 1e18` casts through a 64-bit
      // float first, so the two would disagree on the same input past 2^53 wei.
      totalFees += isLegacy ? Number(formatUnits(BigInt(raw), 18)) : Number(raw);
    };

    chainKeys.forEach((chain, i) => {
      processResult(
        feeResults[i] as unknown as PromiseSettledResult<MechFeesResult>,
        chain,
        blockByChain[chain]
      );
    });
    // Legacy is Gnosis-only, so it is lag-checked against the Gnosis head.
    processResult(
      legacyFeeResult as unknown as PromiseSettledResult<LegacyMechFeesResult>,
      'legacy',
      blockByChain.gnosis ?? null
    );

    return {
      value: totalFees.toFixed(2),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching mech fees:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('mechFees:all'),
    };
  }
};

export type MainMetricsData = {
  dailyActiveAgents: MetricWithStatus<number | null>;
  olasStaked: MetricWithStatus<string | null>;
  transactions: MetricWithStatus<string | null>;
  ataTransactions: MetricWithStatus<string | null>;
  mechFees: MetricWithStatus<string | null>;
  feesCollected: MetricWithStatus<string | null>;
  feesCollectedByToken: MetricWithStatus<MechFeesByToken | null>;
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
      marketplaceFeesResult,
      totalOperatorsResult,
    ] = await Promise.all([
      fetchDailyAgentPerformance(),
      fetchTotalOlasStaked(),
      fetchTransactions(),
      fetchAtaTransactions(),
      fetchMechFees(),
      fetchMechMarketplaceFees(),
      fetchTotalOperators(),
    ]);

    return {
      data: {
        dailyActiveAgents: dailyActiveAgentsResult,
        olasStaked: olasStakedResult,
        transactions: transactionsResult,
        ataTransactions: ataTransactionsResult,
        mechFees: mechFeesResult,
        feesCollected: marketplaceFeesResult.feesCollected,
        feesCollectedByToken: marketplaceFeesResult.feesCollectedByToken,
        totalOperators: totalOperatorsResult,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching main metrics:', error);
    return null;
  }
};
