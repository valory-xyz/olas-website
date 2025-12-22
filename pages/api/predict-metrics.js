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

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours
const LIMIT = 1000;
const PAGES = 10;
const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;
const INVALID_ANSWER_HEX =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const PREDICT_AGENT_IDS_FLAT = Object.values(PREDICT_AGENT_CLASSIFICATION)
  .flat()
  .map((n) => Number(n));

const fetchPredictDaa7dAvg = async () => {
  try {
    const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
    const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

    const { dailyAgentPerformances: rows = [] } =
      await REGISTRY_GRAPH_CLIENTS.gnosis.request(
        dailyPredictAgentsPerformancesQuery,
        {
          agentIds: PREDICT_AGENT_IDS_FLAT,
          timestamp_gt,
          timestamp_lt,
        },
      );

    const totalsByDay = new Map();
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
      0,
    );
    return Math.floor(total / 7);
  } catch (error) {
    throw error;
  }
};

const fetchPredictTxsByAgentType = async () => {
  try {
    const response = await REGISTRY_GRAPH_CLIENTS.gnosis.request(
      agentTxCountsQuery,
      { agentIds: PREDICT_AGENT_IDS_FLAT },
    );

    const rows = response?.agentPerformances || [];
    const idToTx = new Map();
    rows.forEach((row) => {
      idToTx.set(String(row.id), BigInt(row.txCount || 0));
    });

    const result = {};
    Object.entries(PREDICT_AGENT_CLASSIFICATION).forEach(([category, ids]) => {
      let sum = 0n;
      ids.forEach((id) => {
        sum += idToTx.get(String(Number(id))) || 0n;
      });
      result[category] = Number(sum);
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const fetchRoi = async () => {
  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(
      PREDICT_MARKET_DURATION_DAYS,
    );

    // Request fees, payouts, staking rewards and olas price
    const [
      totalRequestsResult,
      marketsAndBetsResult,
      totalRewardsResult,
      olasInUsdPriceResult,
    ] = await Promise.all([
      mechGraphClient.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(
        getMarketsAndBetsQuery(marketOpenTimestamp),
      ),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL),
    ]);

    const olasInUsdPrice = await olasInUsdPriceResult.json();
    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPrice[OLAS_ADDRESS]?.usd || 0) * 1e18),
    );

    // Request all mech requests by pages
    let skip = 0;
    let lastFourDaysRequests = [];

    try {
      while (true) {
        const response = await mechGraphClient.request(
          getMechRequestsQuery({
            timestamp_gt: marketOpenTimestamp,
            first: LIMIT,
            skip,
            pages: PAGES,
          }),
        );

        const pageData = Object.values(response).flat();

        lastFourDaysRequests = lastFourDaysRequests.concat(pageData);
        skip += LIMIT * PAGES;

        // If the returned page is empty, or the amount of items is less
        // than the limit, we're on the last page
        if (
          !Array.isArray(pageData) ||
          pageData.length === 0 ||
          pageData.length < LIMIT * PAGES
        ) {
          break;
        }
      }
    } catch (e) {
      console.error("Couldn't fetch all requests", e);
    }

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const openMarketTitles =
      marketsAndBetsResult.fixedProductMarketMakerCreations.map(
        (market) => market.question,
      );

    // The Mech subgraph calculates totalRequests for all markets.
    // To calculate ROI correctly, we need to subtract the requests
    // made for markets that are still open.
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
      marketsAndBetsResult.global?.totalPayout || 0,
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
      partialRoi: Number(partialRoi) / Number(SCALE),
      finalRoi: Number(finalRoi) / Number(SCALE),
    };
  } catch (error) {
    throw error;
  }
};

const fetchOlasApr = async () => {
  try {
    const contractsResult = await STAKING_GRAPH_CLIENTS.gnosis.request(
      stakingContractsQuery(GNOSIS_STAKING_CONTRACTS),
    );

    const gnosisContracts = contractsResult?.stakingContracts;

    return getMaxApr(gnosisContracts);
  } catch (error) {
    throw error;
  }
};

const fetchSuccessRate = async () => {
  try {
    const closedMarketsBetsResult = await predictAgentsGraphClient.request(
      getClosedMarketsBetsQuery({ first: LIMIT, pages: PAGES }),
    );

    const closedMarketsBets = Object.values(closedMarketsBetsResult).flat();

    const totalBets = closedMarketsBets.length;
    // Calculate amount of won bets
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
    throw error;
  }
};

const fetchAllAgentMetrics = async () => {
  try {
    const [
      roiResult,
      aprResult,
      successRateResult,
      daaResult,
      txsByTypeResult,
    ] = await Promise.allSettled([
      fetchRoi(),
      fetchOlasApr(),
      fetchSuccessRate(),
      fetchPredictDaa7dAvg(),
      fetchPredictTxsByAgentType(),
    ]);

    const metrics = {
      roi: null,
      apr: null,
      successRate: null,
      dailyActiveAgents: null,
      predictTxsByType: null,
    };

    // Process the results from Promise.allSettled
    if (roiResult.status === 'fulfilled') {
      metrics.roi = roiResult.value;
    } else {
      console.error('Fetch ROI for predict failed:', roiResult.reason);
    }

    if (aprResult.status === 'fulfilled') {
      metrics.apr = aprResult.value;
    } else {
      console.error('Fetch APR for predict failed:', aprResult.reason);
    }

    if (successRateResult.status === 'fulfilled') {
      metrics.successRate = successRateResult.value;
    } else {
      console.error(
        'Fetch Success Rate for predict failed:',
        successRateResult.reason,
      );
    }

    if (daaResult.status === 'fulfilled') {
      metrics.dailyActiveAgents = daaResult.value;
    } else {
      console.error('Fetch DAA for predict failed:', daaResult.reason);
    }

    if (txsByTypeResult.status === 'fulfilled') {
      metrics.predictTxsByType = txsByTypeResult.value;
    } else {
      console.error(
        'Fetch Predict txs by agent type failed:',
        txsByTypeResult.reason,
      );
    }

    const data = {
      data: metrics,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching predict metrics:', error);
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
      return res.status(200).json(latestMetrics.data);
    }

    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch agent performance values.' });
  }
}
