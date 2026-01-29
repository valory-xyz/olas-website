import { DEFAULT_MECH_FEE, PREDICT_MARKET_DURATION_DAYS } from 'common-util/constants';
import {
  mechGraphClient,
  predictAgentsGraphClient,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import {
  getMarketsAndBetsQuery,
  getMechRequestsQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const ROI_LIMIT = 1000;
const ROI_PAGES = 10;
const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/xdai?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;

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

type OlasInUsdPriceResponse = {
  [OLAS_ADDRESS]: {
    usd: number;
  };
};

type MechRequestsResponse = {
  questionTitle: string;
}[];

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];

  const indexingErrors = [];
  const laggingSubgraphs = [];

  const gnosisBlock = await getChainBlockNumber('gnosis');

  try {
    while (true) {
      const response = (await mechGraphClient.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: ROI_LIMIT,
          skip,
          pages: ROI_PAGES,
        })
      )) as any;

      if (response?._meta?.hasIndexingErrors) {
        indexingErrors.push('mech:requests');
      }
      if (checkSubgraphLag(gnosisBlock, response?._meta?.block?.number, 'gnosis')) {
        laggingSubgraphs.push('mech:requests');
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
    return {
      data: lastFourDaysRequests.length > 0 ? lastFourDaysRequests : [],
      indexingErrors,
      laggingSubgraphs,
      fetchError: true,
    };
  }

  return { data: lastFourDaysRequests, indexingErrors, laggingSubgraphs, fetchError: false };
};

export const fetchRoi = async (): Promise<
  MetricWithStatus<{ partialRoi: number; finalRoi: number } | null>
> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(PREDICT_MARKET_DURATION_DAYS);

    const [
      totalRequestsResult,
      marketsAndBetsResult,
      totalRewardsResult,
      olasInUsdPriceResult,
      mechRequestsResult,
      gnosisBlock,
    ] = (await Promise.all([
      mechGraphClient.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(getMarketsAndBetsQuery(marketOpenTimestamp)),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL).then((res) => res.json()),
      fetchMechRequests(marketOpenTimestamp),
      getChainBlockNumber('gnosis'),
    ])) as [
      TotalMechRequestsResponse,
      MarketsAndBetsResponse,
      StakingGlobalsResponse,
      OlasInUsdPriceResponse,
      Awaited<ReturnType<typeof fetchMechRequests>>,
      number | null,
    ];

    if (totalRequestsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('mech');
    }
    if (checkSubgraphLag(gnosisBlock, totalRequestsResult._meta?.block?.number, 'gnosis')) {
      laggingSubgraphs.push('mech');
    }
    if (marketsAndBetsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('predictAgents');
    }
    if (checkSubgraphLag(gnosisBlock, marketsAndBetsResult._meta?.block?.number, 'gnosis')) {
      laggingSubgraphs.push('predictAgents');
    }
    if (totalRewardsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('staking:gnosis');
    }
    if (checkSubgraphLag(gnosisBlock, totalRewardsResult._meta?.block?.number, 'gnosis')) {
      laggingSubgraphs.push('staking:gnosis');
    }
    if (mechRequestsResult.indexingErrors.length > 0) {
      indexingErrors.push(...mechRequestsResult.indexingErrors);
    }
    if (mechRequestsResult.fetchError) {
      fetchErrors.push('mech:requests');
    }
    if (mechRequestsResult.laggingSubgraphs.length > 0) {
      laggingSubgraphs.push(...mechRequestsResult.laggingSubgraphs);
    }

    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPriceResult[OLAS_ADDRESS]?.usd || 0) * 1e18)
    );

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const lastFourDaysRequests = mechRequestsResult.data;
    const openMarketTitles = marketsAndBetsResult.fixedProductMarketMakerCreations.map(
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

    const totalMarketPayout = BigInt(marketsAndBetsResult.global?.totalPayout || 0);
    const totalOlasRewardsPayoutInUsd =
      (BigInt(totalRewardsResult.global?.totalRewards || 0) * olasInUsdPriceInEth) / BigInt(1e18);

    const partialRoi = ((totalMarketPayout - totalCosts) * BigInt(100) * SCALE) / totalCosts;
    const finalRoi =
      ((totalMarketPayout + totalOlasRewardsPayoutInUsd - totalCosts) * BigInt(100) * SCALE) /
      totalCosts;

    return {
      value: {
        partialRoi: Number(partialRoi) / Number(SCALE),
        finalRoi: Number(finalRoi) / Number(SCALE),
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching Predict ROI:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('predict:roi'),
    };
  }
};
