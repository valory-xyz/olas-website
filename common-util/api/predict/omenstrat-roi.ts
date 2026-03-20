import { fetchOlasPriceInUsd } from 'common-util/api/predict/olas-price';
import { DEFAULT_MECH_FEE, PREDICT_MARKET_DURATION_DAYS } from 'common-util/constants';
import {
  MARKETPLACE_GRAPH_CLIENTS,
  predictAgentsGraphClient,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import {
  getMarketsAndBetsQuery,
  getMechRequestsQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const LIMIT = 1000;
const PAGES = 10;
const SCALE = 100n; // 2 decimals

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
    totalTradedSettled: number;
    totalFeesSettled: number;
    totalPayout: number;
  };
}>;

type StakingGlobalsResponse = WithMeta<{
  global: {
    totalRewards: number;
  };
}>;

type MechRequest = {
  parsedRequest: {
    questionTitle: string;
  };
};

type MechRequestsResponse = MechRequest[];

type MechRequestsPagedResponse = WithMeta<Record<string, MechRequest[]>>;

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];

  const indexingErrors = [];
  const laggingSubgraphs = [];

  const gnosisBlock = await getChainBlockNumber('gnosis');

  try {
    while (true) {
      const response = (await MARKETPLACE_GRAPH_CLIENTS.gnosis.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: LIMIT,
          skip,
          pages: PAGES,
        })
      )) as MechRequestsPagedResponse;

      if (response?._meta?.hasIndexingErrors) {
        indexingErrors.push('marketplace:gnosis');
      }
      if (checkSubgraphLag(gnosisBlock, response?._meta?.block?.number, 'gnosis')) {
        laggingSubgraphs.push('marketplace:gnosis');
      }

      const pageData = Object.entries(response)
        .filter(([key]) => key !== '_meta')
        .flatMap(([, value]) => value as MechRequest[]);

      lastFourDaysRequests = lastFourDaysRequests.concat(pageData);
      skip += LIMIT * PAGES;

      if (!Array.isArray(pageData) || pageData.length === 0 || pageData.length < LIMIT * PAGES) {
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

export const fetchOmenstratRoi = async (): Promise<
  MetricWithStatus<{ partialRoi: number; finalRoi: number } | null>
> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const marketOpenTimestamp = getMidnightUtcTimestampDaysAgo(PREDICT_MARKET_DURATION_DAYS);

    const results = await Promise.allSettled([
      MARKETPLACE_GRAPH_CLIENTS.gnosis.request(totalMechRequestsQuery),
      predictAgentsGraphClient.request(getMarketsAndBetsQuery(marketOpenTimestamp)),
      STAKING_GRAPH_CLIENTS.gnosis.request(stakingGlobalsQuery),
      fetchOlasPriceInUsd('gnosis'),
      fetchMechRequests(marketOpenTimestamp),
      getChainBlockNumber('gnosis'),
    ]);

    // Handle totalMechRequests
    const totalRequestsResult =
      results[0].status === 'fulfilled' ? (results[0].value as TotalMechRequestsResponse) : null;
    if (!totalRequestsResult) {
      fetchErrors.push('marketplace:gnosis:totalRequests');
    }

    // Handle marketsAndBets
    const marketsAndBetsResult =
      results[1].status === 'fulfilled' ? (results[1].value as MarketsAndBetsResponse) : null;
    if (!marketsAndBetsResult) {
      fetchErrors.push('predict:gnosis');
    }

    // Handle totalRewards
    const totalRewardsResult =
      results[2].status === 'fulfilled' ? (results[2].value as StakingGlobalsResponse) : null;
    if (!totalRewardsResult) {
      fetchErrors.push('staking:gnosis');
    }

    // Handle olasPrice (on-chain via Balancer pool)
    const olasInUsdPriceResult =
      results[3].status === 'fulfilled' ? (results[3].value as bigint | null) : null;
    if (!olasInUsdPriceResult) {
      fetchErrors.push('balancer:olas-price');
    }

    // Handle mechRequests
    const mechRequestsResult =
      results[4].status === 'fulfilled'
        ? (results[4].value as Awaited<ReturnType<typeof fetchMechRequests>>)
        : { data: [], indexingErrors: [], laggingSubgraphs: [], fetchError: true };
    if (mechRequestsResult.fetchError) {
      fetchErrors.push('marketplace:gnosis:mechRequests');
    }

    // Handle gnosisBlock
    const gnosisBlock =
      results[5].status === 'fulfilled' ? (results[5].value as number | null) : null;

    // Check indexing errors and lagging subgraphs
    if (totalRequestsResult?._meta?.hasIndexingErrors) {
      indexingErrors.push('marketplace:gnosis:totalRequests');
    }
    if (
      gnosisBlock &&
      checkSubgraphLag(gnosisBlock, totalRequestsResult?._meta?.block?.number, 'gnosis')
    ) {
      laggingSubgraphs.push('marketplace:gnosis:totalRequests');
    }
    if (marketsAndBetsResult?._meta?.hasIndexingErrors) {
      indexingErrors.push('predict:gnosis');
    }
    if (
      gnosisBlock &&
      checkSubgraphLag(gnosisBlock, marketsAndBetsResult?._meta?.block?.number, 'gnosis')
    ) {
      laggingSubgraphs.push('predict:gnosis');
    }
    if (totalRewardsResult?._meta?.hasIndexingErrors) {
      indexingErrors.push('staking:gnosis');
    }
    if (
      gnosisBlock &&
      checkSubgraphLag(gnosisBlock, totalRewardsResult?._meta?.block?.number, 'gnosis')
    ) {
      laggingSubgraphs.push('staking:gnosis');
    }
    if (mechRequestsResult.indexingErrors.length > 0) {
      indexingErrors.push(...mechRequestsResult.indexingErrors);
    }
    if (mechRequestsResult.laggingSubgraphs.length > 0) {
      laggingSubgraphs.push(...mechRequestsResult.laggingSubgraphs);
    }

    // Return early if critical data is missing
    if (
      !totalRequestsResult ||
      !marketsAndBetsResult ||
      !totalRewardsResult ||
      !olasInUsdPriceResult
    ) {
      return {
        value: null,
        status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
      };
    }

    const olasUsdPriceScaled = olasInUsdPriceResult;

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const lastFourDaysRequests = mechRequestsResult.data;
    const openMarketTitles = marketsAndBetsResult.fixedProductMarketMakerCreations.map(
      (market) => market.question
    );

    let requestsToSubtract = 0;
    lastFourDaysRequests.forEach((request) => {
      if (openMarketTitles.find((title) => title === request.parsedRequest?.questionTitle)) {
        requestsToSubtract += 1;
      }
    });

    const totalCosts =
      BigInt(marketsAndBetsResult.global?.totalTradedSettled || 0) +
      BigInt(marketsAndBetsResult.global?.totalFeesSettled || 0) +
      BigInt(totalMechRequests - requestsToSubtract) * DEFAULT_MECH_FEE;
    const totalMarketPayout = BigInt(marketsAndBetsResult.global?.totalPayout || 0);
    const totalOlasRewardsPayoutInUsd =
      (BigInt(totalRewardsResult.global?.totalRewards || 0) * olasUsdPriceScaled) / BigInt(1e18);

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
    console.error('Error fetching Omenstrat ROI:', error);
    return {
      value: null,
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};
