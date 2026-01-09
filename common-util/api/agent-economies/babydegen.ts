import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  MODIUS_FIXED_END_DATE_UTC,
  MODIUS_STAKING_CONTRACTS,
  OPTIMUS_STAKING_CONTRACTS,
} from 'common-util/constants';
import {
  BABYDEGEN_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
} from 'common-util/graphql/metric-utils';
import {
  dailyBabydegenPerformancesQuery,
  dailyBabydegenPopulationMetricsQuery,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const MODIUS_FIXED_END_TIMESTAMP = Math.floor(
  new Date(MODIUS_FIXED_END_DATE_UTC).getTime() / 1000,
);
const EMPTY_APR_METRICS = {
  latestUsdcApr: null,
  latestEthApr: null,
  stakingAprCalculated: null,
  maxOlasApr: null,
};

type DailyPopulationMetrics = WithMeta<{
  dailyPopulationMetrics: {
    timestamp: number;
    medianAUM: number;
  }[];
}>;

const toNumber = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const fetchModiusPopulationMetrics = async (): Promise<
  MetricWithStatus<any[] | null>
> => {
  return executeGraphQLQuery<DailyPopulationMetrics, any[] | null>({
    client: BABYDEGEN_GRAPH_CLIENTS.mode,
    query: dailyBabydegenPopulationMetricsQuery({
      first: 7,
      timestampLte: MODIUS_FIXED_END_TIMESTAMP,
    } as Parameters<typeof dailyBabydegenPopulationMetricsQuery>[0]),
    source: 'babyDegen:mode',
    transform: (data) => {
      const rows = Array.isArray(data?.dailyPopulationMetrics)
        ? data.dailyPopulationMetrics
        : [];
      if (rows.length === 0) return null;
      if (rows.length < 7) {
        console.error('Not enough Modius population snapshots before cutoff.');
        return null;
      }
      return rows
        .map((row) => ({
          ...row,
          medianFundedAUM: toNumber(row.medianAUM),
        }))
        .reverse();
    },
  });
};

const fetchOptimusPopulationMetrics = async (): Promise<
  MetricWithStatus<any[] | null>
> => {
  return executeGraphQLQuery<DailyPopulationMetrics, any[] | null>({
    client: BABYDEGEN_GRAPH_CLIENTS.optimism,
    query: dailyBabydegenPopulationMetricsQuery({ first: 10 }),
    source: 'babyDegen:optimism',
    transform: (data) => {
      const rows = Array.isArray(data?.dailyPopulationMetrics)
        ? data.dailyPopulationMetrics
        : [];
      if (rows.length === 0) return null;

      // Exclude today (UTC)
      const todayMidnightUtc = getMidnightUtcTimestampDaysAgo(0);
      const filtered = rows.filter(
        (r) => Number(r.timestamp) < todayMidnightUtc,
      );
      if (filtered.length < 7) return null;

      // Map medianAUM to medianFundedAUM
      return filtered
        .slice(0, 7)
        .map((row) => ({
          ...row,
          medianFundedAUM: toNumber(row.medianAUM),
        }))
        .reverse();
    },
  });
};

const buildAprMetrics = ({
  populationMetrics,
  maxOlasApr = null,
}: {
  populationMetrics: any[];
  maxOlasApr: number | null;
}) => {
  if (!Array.isArray(populationMetrics) || populationMetrics.length === 0) {
    return null;
  }

  const latest = populationMetrics[populationMetrics.length - 1];
  const latestUsdcApr = toNumber(latest?.sma7dProjectedUnrealisedPnL);
  const latestEthApr = toNumber(latest?.sma7dEthAdjustedProjectedUnrealisedPnL);

  return {
    latestUsdcApr,
    latestEthApr,
    stakingAprCalculated: maxOlasApr,
    maxOlasApr,
  };
};

const fetchOptimusMetrics = async (
  maxOlasApr: MetricWithStatus<number | null>,
): Promise<MetricWithStatus<any>> => {
  const { value: populationResult, status: populationStatus } =
    await fetchOptimusPopulationMetrics();

  if (!populationResult) {
    return { value: null, status: populationStatus };
  }

  const metrics = buildAprMetrics({
    populationMetrics: populationResult,
    maxOlasApr: maxOlasApr.value,
  });

  return {
    value: metrics ?? { ...EMPTY_APR_METRICS },
    status: createStaleStatus(
      [
        ...(populationStatus.indexingErrors || []),
        ...(maxOlasApr.status.indexingErrors || []),
      ],
      [
        ...(populationStatus.fetchErrors || []),
        ...(maxOlasApr.status.fetchErrors || []),
      ],
    ),
  };
};

const fetchModiusMetrics = async (
  maxOlasApr: MetricWithStatus<number | null>,
): Promise<MetricWithStatus<any>> => {
  const { value: populationResult, status: populationStatus } =
    await fetchModiusPopulationMetrics();

  if (!populationResult) {
    return { value: null, status: populationStatus };
  }

  const aprMetrics = buildAprMetrics({
    populationMetrics: populationResult,
    maxOlasApr: maxOlasApr.value,
  });

  if (!aprMetrics) {
    return {
      value: {
        ...EMPTY_APR_METRICS,
        latestAvgApr: null,
      },
      status: populationStatus,
    };
  }

  return {
    value: {
      ...aprMetrics,
      latestAvgApr: aprMetrics.latestUsdcApr,
    },
    status: createStaleStatus(
      [
        ...(populationStatus.indexingErrors || []),
        ...(maxOlasApr.status.indexingErrors || []),
      ],
      [
        ...(populationStatus.fetchErrors || []),
        ...(maxOlasApr.status.fetchErrors || []),
      ],
    ),
  };
};

const fetchDailyAgentPerformance = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const [modeResult, optimismResult] = await Promise.allSettled([
      REGISTRY_GRAPH_CLIENTS.mode.request(dailyBabydegenPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
      REGISTRY_GRAPH_CLIENTS.optimism.request(dailyBabydegenPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
    ]);

    const handleResult = (
      result: PromiseSettledResult<any>,
      source: string,
    ) => {
      if (result.status === 'rejected') {
        fetchErrors.push(`registry:${source}`);
        return [];
      }
      if (result.value?._meta?.hasIndexingErrors) {
        indexingErrors.push(`registry:${source}`);
      }
      return result.value?.dailyAgentPerformances ?? [];
    };

    const modePerformances = handleResult(modeResult, 'mode');
    const optimismPerformances = handleResult(optimismResult, 'optimism');

    const modeAverage = calculate7DayAverage(
      modePerformances,
      'activeMultisigCount',
    );
    const optimismAverage = calculate7DayAverage(
      optimismPerformances,
      'activeMultisigCount',
    );

    return {
      value: modeAverage + optimismAverage,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching babydegen daily agent performances:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:mode', 'registry:optimism']),
    };
  }
};

type StakingContractsResult = WithMeta<{
  stakingContracts: {
    rewardsPerSecond: string;
    minStakingDeposit: string;
    numAgentInstances: string;
  }[];
}>;

const fetchModiusOlasApr = async (): Promise<
  MetricWithStatus<number | null>
> => {
  return executeGraphQLQuery<StakingContractsResult, number | null>({
    client: STAKING_GRAPH_CLIENTS.mode,
    query: stakingContractsQuery(MODIUS_STAKING_CONTRACTS),
    source: 'staking:mode',
    transform: (data) => {
      const contracts = data?.stakingContracts;
      return contracts && contracts.length > 0 ? getMaxApr(contracts) : null;
    },
  });
};

const fetchOptimusOlasApr = async (): Promise<
  MetricWithStatus<number | null>
> => {
  return executeGraphQLQuery<StakingContractsResult, number | null>({
    client: STAKING_GRAPH_CLIENTS.optimism,
    query: stakingContractsQuery(OPTIMUS_STAKING_CONTRACTS),
    source: 'staking:optimism',
    transform: (data) => {
      const contracts = data?.stakingContracts;
      return contracts && contracts.length > 0 ? getMaxApr(contracts) : null;
    },
  });
};

export const fetchBabyDegenMetrics = async () => {
  try {
    const [modiusApr, optimusApr] = await Promise.all([
      fetchModiusOlasApr(),
      fetchOptimusOlasApr(),
    ]);

    const [modiusMetrics, optimusMetrics, dailyActiveAgents] =
      await Promise.all([
        fetchModiusMetrics(modiusApr),
        fetchOptimusMetrics(optimusApr),
        fetchDailyAgentPerformance(),
      ]);

    return {
      optimus: optimusMetrics,
      modius: modiusMetrics,
      dailyActiveAgents,
    };
  } catch (error) {
    console.error('Error fetching all babydegen metrics:', error);
    const errorStatus = createStaleStatus([], ['babyDegen:all']);
    return {
      optimus: { value: null, status: errorStatus },
      modius: { value: null, status: errorStatus },
      dailyActiveAgents: { value: null, status: errorStatus },
    };
  }
};
