import {
  GNOSIS_STAKING_CONTRACTS,
  OMENSTRAT_AGENT_CLASSIFICATION,
  POLYSTRAT_AGENT_CLASSIFICATION,
} from 'common-util/constants';
import { REGISTRY_GRAPH_CLIENTS, STAKING_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyPredictAgentsPerformancesQuery,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { fetchOmenstratAccuracy, fetchPolystratAccuracy } from './accuracy';
import { emptyWindows, fetchOmenstratBrier, WindowedMetric } from './omenstrat-brier';
import { fetchOmenstratWindowedRoi, fetchPolystratWindowedRoi } from './windowed-roi';

const OMENSTRAT_AGENT_IDS_FLAT = Object.values(OMENSTRAT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));
const POLYSTRAT_AGENT_IDS_FLAT = Object.values(POLYSTRAT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));

type DailyPredictPerformancesResponse = WithMeta<{
  dailyAgentPerformances: {
    dayTimestamp: string;
    activeMultisigCount: number;
  }[];
}>;

type AgentTxCountsResponse = WithMeta<{
  agentPerformances: {
    id: string;
    txCount: string;
  }[];
}>;

type StakingContractsResponse = WithMeta<{
  stakingContracts: any[];
}>;

// Helper function to transform DAA data
const transformDaaData = (data: DailyPredictPerformancesResponse, timestamp_lt: number): number => {
  const rows = data.dailyAgentPerformances || [];
  const totalsByDay = new Map<string, number>();

  rows.forEach((r) => {
    const key = new Date(Number(r.dayTimestamp) * 1000).toISOString().slice(0, 10);
    const prev = totalsByDay.get(key) || 0;
    totalsByDay.set(key, prev + Number(r.activeMultisigCount || 0));
  });

  const dayKeys = [];
  for (let i = 7; i >= 1; i -= 1) {
    const ts = timestamp_lt - i * 24 * 60 * 60;
    dayKeys.push(new Date(ts * 1000).toISOString().slice(0, 10));
  }

  const total = dayKeys.reduce((acc, k) => acc + (totalsByDay.get(k) || 0), 0);

  return Math.floor(total / 7);
};

// Fetch DAA from both Omenstrat and Polystrat
const fetchPredictDaa7dAvg = async (): Promise<{
  omenstrat: MetricWithStatus<number | null>;
  polystrat: MetricWithStatus<number | null>;
}> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  const [omenstratResult, polystratResult] = await Promise.allSettled([
    executeGraphQLQuery<DailyPredictPerformancesResponse, number>({
      client: REGISTRY_GRAPH_CLIENTS.gnosis,
      chain: 'gnosis',
      query: dailyPredictAgentsPerformancesQuery,
      variables: {
        agentIds: OMENSTRAT_AGENT_CLASSIFICATION.valory_trader,
        timestamp_gt,
        timestamp_lt,
      },
      source: 'registry:gnosis',
      transform: (data) => transformDaaData(data, timestamp_lt),
    }),
    executeGraphQLQuery<DailyPredictPerformancesResponse, number>({
      client: REGISTRY_GRAPH_CLIENTS.polygon,
      chain: 'polygon',
      query: dailyPredictAgentsPerformancesQuery,
      variables: {
        agentIds: POLYSTRAT_AGENT_CLASSIFICATION.valory_trader,
        timestamp_gt,
        timestamp_lt,
      },
      source: 'registry:polygon',
      transform: (data) => transformDaaData(data, timestamp_lt),
    }),
  ]);

  const omenstratDaa =
    omenstratResult.status === 'fulfilled'
      ? omenstratResult.value
      : {
          value: null,
          status: createStaleStatus({ indexingErrors: ['registry:gnosis'], fetchErrors: [] }),
        };
  const polystratDaa =
    polystratResult.status === 'fulfilled'
      ? polystratResult.value
      : {
          value: null,
          status: createStaleStatus({ indexingErrors: ['registry:polygon'], fetchErrors: [] }),
        };

  return {
    omenstrat: omenstratDaa,
    polystrat: polystratDaa,
  };
};

const fetchPredictTxsByAgentType = async (): Promise<
  MetricWithStatus<Record<string, number> | null>
> => {
  return executeGraphQLQuery<AgentTxCountsResponse, Record<string, number>>({
    client: REGISTRY_GRAPH_CLIENTS.gnosis,
    chain: 'gnosis',
    query: agentTxCountsQuery,
    variables: { agentIds: OMENSTRAT_AGENT_IDS_FLAT },
    source: 'registry:gnosis',
    transform: (data) => {
      const rows = data?.agentPerformances || [];
      const idToTx = new Map<string, bigint>();
      rows.forEach((row) => {
        idToTx.set(String(row.id), BigInt(row.txCount || 0));
      });

      const result: Record<string, number> = {};
      Object.entries(OMENSTRAT_AGENT_CLASSIFICATION).forEach(([category, ids]) => {
        let sum = 0n;
        ids.forEach((id) => {
          sum += idToTx.get(String(Number(id))) || 0n;
        });
        result[category] = Number(sum);
      });

      return result;
    },
  });
};

const fetchPolystratTxsByAgentType = async (): Promise<
  MetricWithStatus<Record<string, number> | null>
> => {
  return executeGraphQLQuery<AgentTxCountsResponse, Record<string, number>>({
    client: REGISTRY_GRAPH_CLIENTS.polygon, // Polystrat agents on Polygon
    chain: 'polygon',
    query: agentTxCountsQuery,
    variables: { agentIds: POLYSTRAT_AGENT_IDS_FLAT },
    source: 'registry:polygon',
    transform: (data) => {
      const rows = data?.agentPerformances || [];
      const idToTx = new Map<string, bigint>();
      rows.forEach((row) => {
        idToTx.set(String(row.id), BigInt(row.txCount || 0));
      });

      const result: Record<string, number> = {};
      Object.entries(POLYSTRAT_AGENT_CLASSIFICATION).forEach(([category, ids]) => {
        let sum = 0n;
        ids.forEach((id) => {
          sum += idToTx.get(String(Number(id))) || 0n;
        });
        result[category] = Number(sum);
      });

      return result;
    },
  });
};

const fetchOmenstratOlasApr = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<StakingContractsResponse, string>({
    client: STAKING_GRAPH_CLIENTS.gnosis,
    chain: 'gnosis',
    query: stakingContractsQuery(GNOSIS_STAKING_CONTRACTS),
    source: 'staking:gnosis',
    transform: (data) => {
      const contracts = data?.stakingContracts;
      return `${getMaxApr(contracts)}`;
    },
  });
};

const fetchPolystratOlasApr = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<StakingContractsResponse, string>({
    client: STAKING_GRAPH_CLIENTS.polygon,
    chain: 'polygon',
    query: stakingContractsQuery([]), // Query all staking contracts on Polygon
    source: 'staking:polygon',
    transform: (data) => {
      const contracts = data?.stakingContracts;
      return `${getMaxApr(contracts)}`;
    },
  });
};

export type { WindowKey, WindowedMetric } from './omenstrat-brier';

// Snapshot category for the predict metrics blob. The `-v2` suffix is a one-time
// version bump: partialRoi/finalRoi/successRate changed shape (scalar -> windowed
// per-range), a breaking schema change. Bumping the category (rather than the global
// METRICS_PREFIX) isolates the migration to this blob so the Brier, roi-distribution
// and accuracy accumulators don't get reset. Reader and writer must use this.
export const PREDICT_SNAPSHOT_CATEGORY = 'predict-v2';

export type PredictMetricsData = {
  // Omenstrat metrics
  omenstrat: {
    dailyActiveAgents: MetricWithStatus<number | null>;
    apr: MetricWithStatus<string | null>;
    predictTxsByType: MetricWithStatus<Record<string, number> | null>;
    // Windowed prediction-only ROI (excludes staking rewards).
    partialRoi: MetricWithStatus<WindowedMetric<number | null>>;
    // Windowed prediction + staking-rewards ROI (the headline value).
    finalRoi: MetricWithStatus<WindowedMetric<number | null>>;
    // Windowed prediction accuracy (% of settled bets correct, by placement day).
    successRate: MetricWithStatus<WindowedMetric<number | null>>;
    // Windowed mean Brier score (predict-omen only). Lower is better; ~0.25 = a 50/50 guess.
    brierScore: MetricWithStatus<WindowedMetric<number | null>>;
  };

  // Polystrat metrics
  polystrat: {
    dailyActiveAgents: MetricWithStatus<number | null>;
    apr: MetricWithStatus<string | null>;
    predictTxsByType: MetricWithStatus<Record<string, number> | null>;
    partialRoi: MetricWithStatus<WindowedMetric<number | null>>;
    finalRoi: MetricWithStatus<WindowedMetric<number | null>>;
    successRate: MetricWithStatus<WindowedMetric<number | null>>;
  };
};

export type PredictMetricsSnapshot = {
  data: PredictMetricsData;
  timestamp: number;
};

export const fetchAllPredictMetrics = async (): Promise<PredictMetricsSnapshot | null> => {
  try {
    const [
      daaResult,
      omenstratAprResult,
      omenstratTxsResult,
      omenstratRoiResult,
      omenstratSuccessRateResult,
      omenstratBrierResult,
      polystratAprResult,
      polystratTxsResult,
      polystratRoiResult,
      polystratSuccessRateResult,
    ] = await Promise.allSettled([
      // DAA
      fetchPredictDaa7dAvg(),
      // Omenstrat
      fetchOmenstratOlasApr(),
      fetchPredictTxsByAgentType(),
      fetchOmenstratWindowedRoi(),
      fetchOmenstratAccuracy(),
      fetchOmenstratBrier(),
      // Polystrat
      fetchPolystratOlasApr(),
      fetchPolystratTxsByAgentType(),
      fetchPolystratWindowedRoi(),
      fetchPolystratAccuracy(),
    ]);

    // Extract separate DAA values
    const daa =
      daaResult.status === 'fulfilled'
        ? daaResult.value
        : {
            omenstrat: {
              value: null,
              status: getFetchErrorAndCreateStaleStatus('registry:gnosis'),
            },
            polystrat: {
              value: null,
              status: getFetchErrorAndCreateStaleStatus('registry:polygon'),
            },
          };

    const data: PredictMetricsData = {
      omenstrat: {
        dailyActiveAgents: daa.omenstrat,
        apr:
          omenstratAprResult.status === 'fulfilled'
            ? omenstratAprResult.value
            : { value: null, status: getFetchErrorAndCreateStaleStatus('omenstrat:apr') },
        predictTxsByType:
          omenstratTxsResult.status === 'fulfilled'
            ? omenstratTxsResult.value
            : { value: null, status: getFetchErrorAndCreateStaleStatus('omenstrat:txs') },
        partialRoi:
          omenstratRoiResult.status === 'fulfilled'
            ? omenstratRoiResult.value.partialRoi
            : { value: emptyWindows(), status: getFetchErrorAndCreateStaleStatus('omenstrat:roi') },
        finalRoi:
          omenstratRoiResult.status === 'fulfilled'
            ? omenstratRoiResult.value.finalRoi
            : { value: emptyWindows(), status: getFetchErrorAndCreateStaleStatus('omenstrat:roi') },
        successRate:
          omenstratSuccessRateResult.status === 'fulfilled'
            ? omenstratSuccessRateResult.value
            : {
                value: emptyWindows(),
                status: getFetchErrorAndCreateStaleStatus('omenstrat:successRate'),
              },
        brierScore:
          omenstratBrierResult.status === 'fulfilled'
            ? omenstratBrierResult.value
            : {
                value: emptyWindows(),
                status: getFetchErrorAndCreateStaleStatus('omenstrat:brier'),
              },
      },

      polystrat: {
        dailyActiveAgents: daa.polystrat,
        apr:
          polystratAprResult.status === 'fulfilled'
            ? polystratAprResult.value
            : { value: null, status: getFetchErrorAndCreateStaleStatus('polystrat:apr') },
        predictTxsByType:
          polystratTxsResult.status === 'fulfilled'
            ? polystratTxsResult.value
            : { value: null, status: getFetchErrorAndCreateStaleStatus('polystrat:txs') },
        partialRoi:
          polystratRoiResult.status === 'fulfilled'
            ? polystratRoiResult.value.partialRoi
            : { value: emptyWindows(), status: getFetchErrorAndCreateStaleStatus('polystrat:roi') },
        finalRoi:
          polystratRoiResult.status === 'fulfilled'
            ? polystratRoiResult.value.finalRoi
            : { value: emptyWindows(), status: getFetchErrorAndCreateStaleStatus('polystrat:roi') },
        successRate:
          polystratSuccessRateResult.status === 'fulfilled'
            ? polystratSuccessRateResult.value
            : {
                value: emptyWindows(),
                status: getFetchErrorAndCreateStaleStatus('polystrat:successRate'),
              },
      },
    };

    return {
      data,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching all predict metrics:', error);
    return null;
  }
};
