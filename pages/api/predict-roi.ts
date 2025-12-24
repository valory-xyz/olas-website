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
  getMechRequestsQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;
const LIMIT = 1000;
const PAGES = 10;

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

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  // Request all mech requests by pages
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];

  try {
    while (true) {
      const response = await mechGraphClient.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: LIMIT,
          skip,
          pages: PAGES,
        })
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

  return lastFourDaysRequests;
};

const fetchRoi = async () => {
  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(
      PREDICT_MARKET_DURATION_DAYS
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
        getMarketsAndBetsQuery(marketOpenTimestamp)
      ),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL),
      fetchMechRequests(marketOpenTimestamp),
    ]);

    const olasInUsdPrice = await olasInUsdPriceResult.json();
    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPrice[OLAS_ADDRESS]?.usd || 0) * 1e18)
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
          0
      ) +
      BigInt(
        (marketsAndBetsResult as MarketsAndBetsResponse).global?.totalFees || 0
      ) +
      BigInt(totalMechRequests - requestsToSubtract) * DEFAULT_MECH_FEE;

    const totalMarketPayout = BigInt(
      (marketsAndBetsResult as MarketsAndBetsResponse).global?.totalPayout || 0
    );
    const totalOlasRewardsPayoutInUsd =
      (BigInt(
        (totalRewardsResult as StakingGlobalsResponse).global?.totalRewards || 0
      ) *
        olasInUsdPriceInEth) /
      BigInt(1e18);

    const partialRoi =
      ((totalMarketPayout - totalCosts) * BigInt(100)) / totalCosts;
    const finalRoi =
      ((totalMarketPayout + totalOlasRewardsPayoutInUsd - totalCosts) *
        BigInt(100)) /
      totalCosts;

    return { partialRoi: Number(partialRoi), finalRoi: Number(finalRoi) };
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
    `s-maxage=${CACHE_DURATION_SECONDS}`
  );
  res.setHeader('CDN-Cache-Control', `s-maxage=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`
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
