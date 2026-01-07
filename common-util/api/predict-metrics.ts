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
    agentTxCountsQuery,
    dailyPredictAgentsPerformancesQuery,
    getClosedMarketsBetsQuery,
    getMarketsAndBetsQuery,
    getMechRequestsQuery,
    stakingContractsQuery,
    stakingGlobalsQuery,
    totalMechRequestsQuery,
} from 'common-util/graphql/queries';
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

type TotalMechRequestsResponse = {
  global: {
    totalRequests: number;
  };
};

type MarketsAndBetsResponse = {
  fixedProductMarketMakerCreations: {
    question: string;
  }[];
  global: {
    totalTraded: number;
    totalFees: number;
    totalPayout: number;
  };
};

type StakingGlobalsResponse = {
  global: {
    totalRewards: number;
  };
};

type MechRequestsResponse = {
  questionTitle: string;
}[];

type OlasInUsdPriceResponse = {
  [OLAS_ADDRESS]: {
    usd: number;
  };
};

const fetchPredictDaa7dAvg = async (): Promise<number | null> => {
  try {
    const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
    const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

    const result = (await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      dailyPredictAgentsPerformancesQuery,
      {
        agentIds: PREDICT_AGENT_IDS_FLAT,
        timestamp_gt,
        timestamp_lt,
      },
    )) as { dailyAgentPerformances: any[] };

    const rows = result.dailyAgentPerformances || [];
    const totalsByDay = new Map<string, number>();

    rows.forEach((r: any) => {
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
      0,
    );
    return Math.floor(total / 7);
  } catch (error) {
    console.error('Error fetching Predict DAA:', error);
    return null;
  }
};

const fetchPredictTxsByAgentType = async (): Promise<Record<
  string,
  number
> | null> => {
  try {
    const response = (await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      agentTxCountsQuery,
      { agentIds: PREDICT_AGENT_IDS_FLAT },
    )) as { agentPerformances: any[] };

    const rows = response?.agentPerformances || [];
    const idToTx = new Map<string, bigint>();
    rows.forEach((row: any) => {
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
  } catch (error) {
    console.error('Error fetching Predict Txs:', error);
    return null;
  }
};

const fetchOlasApr = async (): Promise<string | null> => {
  try {
    const contractsResult = (await STAKING_GRAPH_CLIENTS.gnosis.request(
      stakingContractsQuery(GNOSIS_STAKING_CONTRACTS),
    )) as { stakingContracts: any[] };

    const gnosisContracts = contractsResult?.stakingContracts;

    return `${getMaxApr(gnosisContracts)}`;
  } catch (error) {
    console.error('Error fetching OLAS APR:', error);
    return null;
  }
};


const fetchMechRequests = async (marketOpenTimestamp: number) => {
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];

  try {
    while (true) {
      const response = await mechGraphClient.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: ROI_LIMIT,
          skip,
          pages: ROI_PAGES,
        }),
      );

      const pageData = Object.values(response).flat() as any[];

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
  }

  return lastFourDaysRequests;
};

const fetchRoi = async (): Promise<{
  partialRoi: number;
  finalRoi: number;
} | null> => {
  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(
      PREDICT_MARKET_DURATION_DAYS,
    );

    const [
      totalRequestsResult,
      marketsAndBetsResult,
      totalRewardsResult,
      olasInUsdPriceResult,
      lastFourDaysRequests,
    ] = (await Promise.all([
      mechGraphClient.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(
        getMarketsAndBetsQuery(marketOpenTimestamp),
      ),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL).then((res) => res.json()),
      fetchMechRequests(marketOpenTimestamp),
    ])) as [
      TotalMechRequestsResponse,
      MarketsAndBetsResponse,
      StakingGlobalsResponse,
      OlasInUsdPriceResponse,
      MechRequestsResponse,
    ];

    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPriceResult[OLAS_ADDRESS]?.usd || 0) * 1e18),
    );

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const openMarketTitles =
      marketsAndBetsResult.fixedProductMarketMakerCreations.map(
        (market) => market.question,
      );

    let requestsToSubtract = 0;
    lastFourDaysRequests.forEach((request) => {
      if (openMarketTitles.find((title) => title === request.questionTitle)) {
        requestsToSubtract += 1;
      }
    });

    const totalCosts =
      BigInt(
        (marketsAndBetsResult as MarketsAndBetsResponse).global?.totalTraded ||
          0,
      ) +
      BigInt(
        (marketsAndBetsResult as MarketsAndBetsResponse).global?.totalFees || 0,
      ) +
      BigInt(totalMechRequests - requestsToSubtract) * DEFAULT_MECH_FEE;

    const totalMarketPayout = BigInt(
      (marketsAndBetsResult as MarketsAndBetsResponse).global?.totalPayout || 0,
    );
    const totalOlasRewardsPayoutInUsd =
      (BigInt(
        (totalRewardsResult as StakingGlobalsResponse).global?.totalRewards ||
          0,
      ) *
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
      partialRoi: Number(partialRoi) / Number(SCALE),
      finalRoi: Number(finalRoi) / Number(SCALE),
    };
  } catch (error) {
    console.error('Error fetching Predict ROI:', error);
    return null;
  }
};

const fetchSuccessRate = async (): Promise<string | null> => {
  try {
    const closedMarketsBetsResult = (await predictAgentsGraphClient.request(
      getClosedMarketsBetsQuery({ first: SUCCESS_LIMIT, pages: SUCCESS_PAGES }),
    )) as any;

    const closedMarketsBets = Object.values(closedMarketsBetsResult).flat() as any[];

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
  } catch (error) {
    console.error('Error fetching Predict Success Rate:', error);
    return null;
  }
};

export const fetchAllPredictMetrics = async () => {
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

    const metrics = {
      apr: null,
      dailyActiveAgents: null,
      predictTxsByType: null,
      partialRoi: null,
      finalRoi: null,
      successRate: null,
    };

    if (aprResult.status === 'fulfilled') {
      metrics.apr = aprResult.value;
    }
    if (daaResult.status === 'fulfilled') {
      metrics.dailyActiveAgents = daaResult.value;
    }
    if (txsByTypeResult.status === 'fulfilled') {
      metrics.predictTxsByType = txsByTypeResult.value;
    }
    if (roiResult.status === 'fulfilled' && roiResult.value) {
      metrics.partialRoi = roiResult.value.partialRoi;
      metrics.finalRoi = roiResult.value.finalRoi;
    }
    if (successRateResult.status === 'fulfilled') {
      metrics.successRate = successRateResult.value;
    }

    return {
      data: metrics,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching all predict metrics:', error);
    return null;
  }
};
