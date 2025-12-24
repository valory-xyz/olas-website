import {
  CACHE_DURATION_SECONDS,
  DEFAULT_MECH_FEE,
  PREDICT_MARKET_DURATION_DAYS,
} from 'common-util/constants';
import {
  mechGraphClient,
  predictAgentsGraphClient,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  getMarketsAndBetsQuery,
  getMechRequestsRangeQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;

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
  requests: {
    questionTitle: string;
  }[];
};

const LIMIT = 1000;

type RecursivelyFetchQueryDataParams = {
  start: number;
  end: number;
  queryBuilderFn: (start: number, end: number) => string;
  extractor: (response: unknown) => unknown[];
};

export async function recursivelyFetchQueryData({
  start,
  end,
  queryBuilderFn,
  extractor,
}: RecursivelyFetchQueryDataParams) {
  const initialChunkSize = 6 * 60 * 60; // 6-hour chunks
  const totalDuration = end - start;
  const chunkCount = Math.ceil(totalDuration / initialChunkSize);

  const fetchRecursive = async (chunkStart, chunkEnd) => {
    try {
      const query = queryBuilderFn(chunkStart, chunkEnd);
      const response = await mechGraphClient.request(query);
      const data = extractor(response);

      // If items are less than limit, there are no more items in this range
      if (data.length < LIMIT) {
        return data;
      }

      // If there are more items, we split the duration into two halves to fetch them in parallel manner
      const mid = Math.floor((chunkStart + chunkEnd) / 2);

      // Prevent infinite loops if multiple items share the exact same second
      if (mid <= chunkStart) {
        return data;
      }

      const [left, right] = await Promise.all([
        fetchRecursive(chunkStart, mid),
        fetchRecursive(mid, chunkEnd),
      ]);

      return [...left, ...right];
    } catch (err) {
      console.error(`Error fetching range ${chunkStart}-${chunkEnd}`, err);
      throw err;
    }
  };

  const initialPromises = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunkStart = start + i * initialChunkSize;
    const chunkEnd = Math.min(end, chunkStart + initialChunkSize);

    initialPromises.push(fetchRecursive(chunkStart, chunkEnd));
  }

  const results = await Promise.all(initialPromises);
  const flatData = results.flat();

  // Deduplicate
  const uniqueMap = new Map();
  flatData.forEach((item) => {
    if (item.id) uniqueMap.set(item.id, item);
  });

  return Array.from(uniqueMap.values());
}

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  const today = getMidnightUtcTimestampDaysAgo(0);
  const lastFourDaysRequests = await recursivelyFetchQueryData({
    queryBuilderFn: getMechRequestsRangeQuery,
    extractor: (response: MechRequestsResponse) => response.requests,
    start: marketOpenTimestamp,
    end: today,
  });

  return lastFourDaysRequests;
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
      lastFourDaysRequests,
    ] = await Promise.all([
      mechGraphClient.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(
        getMarketsAndBetsQuery(marketOpenTimestamp),
      ),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL),
      fetchMechRequests(marketOpenTimestamp),
    ]);

    const olasInUsdPrice = await olasInUsdPriceResult.json();
    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPrice[OLAS_ADDRESS]?.usd || 0) * 1e18),
    );

    const totalMechRequests = (totalRequestsResult as TotalMechRequestsResponse)
      .global.totalRequests;
    const openMarketTitles = (
      marketsAndBetsResult as MarketsAndBetsResponse
    ).fixedProductMarketMakerCreations.map((market) => market.question);

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
    throw error;
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
    const roi = await fetchRoi();

    if (!roi) {
      return res.status(500).json({ message: 'Failed to fetch ROI' });
    }

    return res.status(200).json(roi);
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ message: 'Failed to fetch ROI' });
  }
}
