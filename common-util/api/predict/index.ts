import {
  GNOSIS_STAKING_CONTRACTS,
  PREDICT_AGENT_CLASSIFICATION
} from 'common-util/constants';
import {
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS
} from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
} from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyPredictAgentsPerformancesQuery,
  stakingContractsQuery
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { fetchRoi } from './roi';
import { fetchSuccessRate } from './success-rate';

const PREDICT_AGENT_IDS_FLAT = Object.values(PREDICT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));

const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;
const ROI_LIMIT = 1000;
const ROI_PAGES = 10;


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

const fetchPredictDaa7dAvg = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  return executeGraphQLQuery<DailyPredictPerformancesResponse, number>({
    client: REGISTRY_GRAPH_CLIENTS.gnosis,
    query: dailyPredictAgentsPerformancesQuery,
    variables: {
      agentIds: PREDICT_AGENT_IDS_FLAT,
      timestamp_gt,
      timestamp_lt,
    },
    // TODO: move these to consts for better maintainability
    source: 'registry:gnosis',
    transform: (data) => {
      const rows = data.dailyAgentPerformances || [];
      const totalsByDay = new Map<string, number>();

      rows.forEach((r) => {
        const key = new Date(Number(r.dayTimestamp) * 1000)
          .toISOString()
          .slice(0, 10);
        const prev = totalsByDay.get(key) || 0;
        totalsByDay.set(key, prev + Number(r.activeMultisigCount || 0));
      });

      const dayKeys = [];
      for (let i = 7; i >= 1; i -= 1) {
        const ts = timestamp_lt - i * 24 * 60 * 60;
        dayKeys.push(new Date(ts * 1000).toISOString().slice(0, 10));
      }

      const total = dayKeys.reduce(
        (acc, k) => acc + (totalsByDay.get(k) || 0),
        0
      );

      return Math.floor(total / 7);
    },
  });
};

const fetchPredictTxsByAgentType = async (): Promise<
  MetricWithStatus<Record<string, number> | null>
> => {
  return executeGraphQLQuery<AgentTxCountsResponse, Record<string, number>>({
    client: REGISTRY_GRAPH_CLIENTS.gnosis,
    query: agentTxCountsQuery,
    variables: { agentIds: PREDICT_AGENT_IDS_FLAT },
    source: 'registry:gnosis',
    transform: (data) => {
      const rows = data?.agentPerformances || [];
      const idToTx = new Map<string, bigint>();
      rows.forEach((row) => {
        idToTx.set(String(row.id), BigInt(row.txCount || 0));
      });

      const result: Record<string, number> = {};
      Object.entries(PREDICT_AGENT_CLASSIFICATION).forEach(([category, ids]) => {
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

const fetchOlasApr = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<StakingContractsResponse, string>({
    client: STAKING_GRAPH_CLIENTS.gnosis,
    query: stakingContractsQuery(GNOSIS_STAKING_CONTRACTS),
    source: 'staking:gnosis',
    transform: (data) => {
      const contracts = data?.stakingContracts;
      return `${getMaxApr(contracts)}`;
    },
  });
};

export type PredictMetricsData = {
  apr: MetricWithStatus<string | null>;
  dailyActiveAgents: MetricWithStatus<number | null>;
  predictTxsByType: MetricWithStatus<Record<string, number> | null>;
  partialRoi: MetricWithStatus<number | null>;
  finalRoi: MetricWithStatus<number | null>;
  successRate: MetricWithStatus<string | null>;
};

export type PredictMetricsSnapshot = {
  data: PredictMetricsData;
  timestamp: number;
};

export const fetchAllPredictMetrics =
  async (): Promise<PredictMetricsSnapshot | null> => {
    try {
      const [
        aprResult,
        daaResult,
        txsByTypeResult,
        roiResult,
        successRateResult,
      ] = await Promise.allSettled([
        fetchOlasApr(),
        fetchPredictDaa7dAvg(),
        fetchPredictTxsByAgentType(),
        fetchRoi(),
        fetchSuccessRate(),
      ]);

      const data: PredictMetricsData = {
        apr:
          aprResult.status === 'fulfilled'
            ? aprResult.value
            : { value: null, status: createStaleStatus([], ['predict:apr']) },
        dailyActiveAgents:
          daaResult.status === 'fulfilled'
            ? daaResult.value
            : { value: null, status: createStaleStatus([], ['predict:daa']) },
        predictTxsByType:
          txsByTypeResult.status === 'fulfilled'
            ? txsByTypeResult.value
            : { value: null, status: createStaleStatus([], ['predict:txs']) },
        partialRoi:
          roiResult.status === 'fulfilled' && roiResult.value.value
            ? {
                value: roiResult.value.value.partialRoi,
                status: roiResult.value.status,
              }
            : { value: null, status: createStaleStatus([], ['predict:roi']) },
        finalRoi:
          roiResult.status === 'fulfilled' && roiResult.value.value
            ? {
                value: roiResult.value.value.finalRoi,
                status: roiResult.value.status,
              }
            : { value: null, status: createStaleStatus([], ['predict:roi']) },
        successRate:
          successRateResult.status === 'fulfilled'
            ? successRateResult.value
            : {
                value: null,
                status: createStaleStatus([], ['predict:successRate']),
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
