import { DEFAULT_MECH_FEE, PREDICT_MARKET_DURATION_DAYS } from 'common-util/constants';
import {
  MARKETPLACE_GRAPH_CLIENTS,
  polymarketAgentsGraphClient,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import {
  getMechRequestsQuery,
  getPolymarketMarketsDataQuery,
  stakingGlobalsQuery,
  totalMechRequestsQuery,
} from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const LIMIT = 1000;
const PAGES = 10;
const SCALE = 100n; // 2 decimals
const OLAS_ADDRESS = '0xfef5d947472e72efbb2e388c730b7428406f2f95';
const COINGECKO_OLAS_IN_USD_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`;

type TotalMechRequestsResponse = WithMeta<{
  global: {
    totalRequests: number;
  };
}>;

type MarketParticipant = {
  id: string;
  question: {
    blockTimestamp: string;
    resolution: {
      id: string;
    } | null;
    metadata: {
      id: string;
      title: string;
    };
  };
};

type OpenMarketsResponse = WithMeta<
  Record<string, MarketParticipant[]> & {
    global: {
      totalPayout: number;
      totalTradedSettled: number;
    };
  }
>;

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
  parsedRequest: {
    questionTitle: string;
  };
}[];

const fetchMechRequests = async (marketOpenTimestamp: number) => {
  let skip = 0;
  let lastFourDaysRequests: MechRequestsResponse = [];

  const indexingErrors = [];
  const laggingSubgraphs = [];

  const polygonBlock = await getChainBlockNumber('polygon');

  try {
    while (true) {
      const response = (await MARKETPLACE_GRAPH_CLIENTS.polygon.request(
        getMechRequestsQuery({
          timestamp_gt: marketOpenTimestamp,
          first: LIMIT,
          skip,
          pages: PAGES,
        })
      )) as any;

      if (response?._meta?.hasIndexingErrors) {
        indexingErrors.push('marketplace:polygon');
      }
      if (checkSubgraphLag(polygonBlock, response?._meta?.block?.number, 'polygon')) {
        laggingSubgraphs.push('marketplace:polygon');
      }

      const pageData = Object.entries(response)
        .filter(([key]) => key !== '_meta')
        .flatMap(([, value]) => value) as any[];

      lastFourDaysRequests = lastFourDaysRequests.concat(pageData);
      skip += LIMIT * PAGES;

      if (!Array.isArray(pageData) || pageData.length === 0 || pageData.length < LIMIT * PAGES) {
        break;
      }
    }
  } catch (e) {
    console.error("Couldn't fetch all mech requests", e);
    return {
      data: lastFourDaysRequests.length > 0 ? lastFourDaysRequests : [],
      indexingErrors,
      laggingSubgraphs,
      fetchError: true,
    };
  }

  return { data: lastFourDaysRequests, indexingErrors, laggingSubgraphs, fetchError: false };
};

export const fetchPolystratRoi = async (): Promise<
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
      polygonBlock,
    ] = (await Promise.all([
      MARKETPLACE_GRAPH_CLIENTS.polygon.request(totalMechRequestsQuery),
      polymarketAgentsGraphClient.request(
        getPolymarketMarketsDataQuery({ first: 1000, pages: 10 })
      ),
      STAKING_GRAPH_CLIENTS.polygon.request(stakingGlobalsQuery),
      fetch(COINGECKO_OLAS_IN_USD_PRICE_URL).then((res) => res.json()),
      fetchMechRequests(marketOpenTimestamp),
      getChainBlockNumber('polygon'),
    ])) as [
      TotalMechRequestsResponse,
      OpenMarketsResponse,
      StakingGlobalsResponse,
      OlasInUsdPriceResponse,
      Awaited<ReturnType<typeof fetchMechRequests>>,
      number | null,
    ];

    // Track indexing errors and lagging subgraphs
    if (totalRequestsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('marketplace:polygon');
    }
    if (checkSubgraphLag(polygonBlock, totalRequestsResult._meta?.block?.number, 'polygon')) {
      laggingSubgraphs.push('marketplace:polygon');
    }
    if (marketsAndBetsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('polymarket:polygon');
    }
    if (checkSubgraphLag(polygonBlock, marketsAndBetsResult._meta?.block?.number, 'polygon')) {
      laggingSubgraphs.push('polymarket:polygon');
    }
    if (totalRewardsResult._meta?.hasIndexingErrors) {
      indexingErrors.push('staking:polygon');
    }
    if (checkSubgraphLag(polygonBlock, totalRewardsResult._meta?.block?.number, 'polygon')) {
      laggingSubgraphs.push('staking:polygon');
    }
    if (mechRequestsResult.indexingErrors.length > 0) {
      indexingErrors.push(...mechRequestsResult.indexingErrors);
    }
    if (mechRequestsResult.fetchError) {
      fetchErrors.push('mech:polygon');
    }
    if (mechRequestsResult.laggingSubgraphs.length > 0) {
      laggingSubgraphs.push(...mechRequestsResult.laggingSubgraphs);
    }

    const olasInUsdPriceInEth = BigInt(
      Math.floor(Number(olasInUsdPriceResult[OLAS_ADDRESS]?.usd || 0) * 1e18)
    );

    const totalMechRequests = totalRequestsResult.global.totalRequests;
    const lastFourDaysRequests = mechRequestsResult.data;

    // Flatten all market participants from paginated query
    const allMarketParticipants = Object.entries(marketsAndBetsResult)
      .filter(([key]) => key !== '_meta' && key !== 'global')
      .flatMap(([, value]) => value as MarketParticipant[]);

    // Filter for open markets (where resolution is null) and recent markets
    const openMarketParticipants = allMarketParticipants.filter((participant) => {
      const hasNoResolution = !participant.question?.resolution;
      return hasNoResolution;
    });

    // Get open market titles and sum totalPayout
    const openMarketTitles = openMarketParticipants.map((p) => p.question.metadata.title);

    let requestsToSubtract = 0;
    lastFourDaysRequests.forEach((request) => {
      if (openMarketTitles.find((title) => title === request.parsedRequest?.questionTitle)) {
        requestsToSubtract += 1;
      }
    });

    // Note: totalTradedSettled and totalPayout are in USDC.e (6 decimals), so we convert to 18 decimals
    // by multiplying by 10**12 to match OLAS and mech fee decimals
    const totalCosts =
      BigInt(marketsAndBetsResult.global?.totalTradedSettled || 0) * BigInt(1e12) +
      BigInt(totalMechRequests - requestsToSubtract) * DEFAULT_MECH_FEE;
    const totalMarketPayout = BigInt(marketsAndBetsResult.global?.totalPayout || 0) * BigInt(1e12);
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
    console.error('Error fetching Polystrat ROI:', error);
    return {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: ['polystrat:roi'] }),
    };
  }
};
