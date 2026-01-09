import {
  DEFAULT_MECH_FEE,
  GNOSIS_STAKING_CONTRACTS,
  PREDICT_AGENT_CLASSIFICATION,
  PREDICT_MARKET_DURATION_DAYS,
} from 'common-util/constants';
import {
  mechGraphClient,
  predictAgentsGraphClient,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
} from 'common-util/graphql/metric-utils';
import {
  agentTxCountsQuery,
  dailyPredictAgentsPerformancesQuery,
  getClosedMarketsBetsQuery,
  getMarketsAndBetsQuery,
  getMechRequestsQuery,
  stakingContractsQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const PREDICT_AGENT_IDS_FLAT = Object.values(PREDICT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));

const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;
const ROI_LIMIT = 1000;
const ROI_PAGES = 10;

const SUCCESS_LIMIT = 1000;
const SUCCESS_PAGES = 10;
const INVALID_ANSWER_HEX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

type TotalMechRequestsResponse = WithMeta<{
  global: {
    totalRequests: number;
  };
}>;

type MarketsAndBetsResponse = WithMeta<{
  fixedProductMarketMakerCreations: {
    question: string;
  }[];
  global: {
    totalTraded: number;
    totalFees: number;
    totalPayout: number;
  };
}>;

type StakingGlobalsResponse = WithMeta<{
  global: {
    totalRewards: number;
  };
}>;

type MechRequestsResponse = {
  questionTitle: string;
}[];

type OlasInUsdPriceResponse = {
  [OLAS_ADDRESS]: {
    usd: number;
  };
};

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

type ClosedMarketsBetsResponse = WithMeta<Record<string, any[]>>;

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

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];
  let hasIndexingErrors = false;

  try {
    while (true) {
      const response = await mechGraphClient.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: ROI_LIMIT,
          skip,
          pages: ROI_PAGES,
        })
      ) as any;

      if (response?._meta?.hasIndexingErrors) {
        hasIndexingErrors = true;
      }

      const pageData = Object.entries(response)
        .filter(([key]) => key !== '_meta')
        .flatMap(([, value]) => value) as any[];

      lastFourDaysRequests = lastFourDaysRequests.concat(pageData);
      skip += ROI_LIMIT * ROI_PAGES;

      if (
        !Array.isArray(pageData) ||
        pageData.length === 0 ||
        pageData.length < ROI_LIMIT * ROI_PAGES
      ) {
        break;
      }
    }
  } catch (e) {
    console.error("Couldn't fetch all requests", e);
    return { data: lastFourDaysRequests.length > 0 ? lastFourDaysRequests : [], hasIndexingErrors: false, fetchError: true };
  }

  return { data: lastFourDaysRequests, hasIndexingErrors, fetchError: false };
};

const fetchRoi = async (): Promise<
  MetricWithStatus<{ partialRoi: number; finalRoi: number } | null>
> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(
      PREDICT_MARKET_DURATION_DAYS
    );

    const [
      totalRequestsResult,
      marketsAndBetsResult,
      totalRewardsResult,
      olasInUsdPriceResult,
      mechRequestsResult,
    ] = (await Promise.all([
      mechGraphClient.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(
        getMarketsAndBetsQuery(marketOpenTimestamp)
      ),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL).then((res) => res.json()),
      fetchMechRequests(marketOpenTimestamp),
    ])) as [
      TotalMechRequestsResponse,
      MarketsAndBetsResponse,
      StakingGlobalsResponse,
      OlasInUsdPriceResponse,
      Awaited<ReturnType<typeof fetchMechRequests>>,
    ];

    if (totalRequestsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('mech');
    }
    if (marketsAndBetsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('predictAgents');
    }
    if (totalRewardsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('staking:gnosis');
    }
    if (mechRequestsResult.hasIndexingErrors) {
      indexingErrors.push('mech:requests');
    }
    if (mechRequestsResult.fetchError) {
      fetchErrors.push('mech:requests');
    }

    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPriceResult[OLAS_ADDRESS]?.usd || 0) * 1e18)
    );

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const lastFourDaysRequests = mechRequestsResult.data;
    const openMarketTitles =
      marketsAndBetsResult.fixedProductMarketMakerCreations.map(
        (market) => market.question
      );

    let requestsToSubtract = 0;
    lastFourDaysRequests.forEach((request) => {
      if (openMarketTitles.find((title) => title === request.questionTitle)) {
        requestsToSubtract += 1;
      }
    });

    const totalCosts =
      BigInt(marketsAndBetsResult.global?.totalTraded || 0) +
      BigInt(marketsAndBetsResult.global?.totalFees || 0) +
      BigInt(totalMechRequests - requestsToSubtract) * DEFAULT_MECH_FEE;

    const totalMarketPayout = BigInt(
      marketsAndBetsResult.global?.totalPayout || 0
    );
    const totalOlasRewardsPayoutInUsd =
      (BigInt(totalRewardsResult.global?.totalRewards || 0) *
        olasInUsdPriceInEth) /
      BigInt(1e18);

    const partialRoi =
      ((totalMarketPayout - totalCosts) * BigInt(100) * SCALE) / totalCosts;
    const finalRoi =
      ((totalMarketPayout + totalOlasRewardsPayoutInUsd - totalCosts) *
        BigInt(100) *
        SCALE) /
      totalCosts;

    return {
      value: {
        partialRoi: Number(partialRoi) / Number(SCALE),
        finalRoi: Number(finalRoi) / Number(SCALE),
      },
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching Predict ROI:', error);
    return {
      value: null,
      status: createStaleStatus([], ['predict:roi']),
    };
  }
};

const fetchSuccessRate = async (): Promise<MetricWithStatus<string | null>> => {
  return executeGraphQLQuery<ClosedMarketsBetsResponse, string>({
    client: predictAgentsGraphClient,
    query: getClosedMarketsBetsQuery({ first: SUCCESS_LIMIT, pages: SUCCESS_PAGES }),
    source: 'predictAgents',
    transform: (data) => {
      const closedMarketsBets = Object.entries(data)
        .filter(([key]) => key !== '_meta')
        .flatMap(([, value]) => value) as any[];

      const totalBets = closedMarketsBets.length;
      let wonBets = 0;

      closedMarketsBets.forEach((bet) => {
        const marketAnswer = bet.fixedProductMarketMaker.currentAnswer;
        const betAnswer = bet.outcomeIndex;
        if (marketAnswer === INVALID_ANSWER_HEX) return;
        if (Number(marketAnswer) === Number(betAnswer)) {
          wonBets += 1;
        }
      });

      return ((wonBets / totalBets) * 100).toFixed(0);
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
