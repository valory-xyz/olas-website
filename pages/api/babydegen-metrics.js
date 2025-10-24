import { Client } from '@gradio/client';
import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import {
  CACHE_DURATION_SECONDS,
  MODIUS_STAKING_CONTRACTS,
  OPTIMUS_STAKING_CONTRACTS,
} from 'common-util/constants';
import {
  BABYDEGEN_GRAPH_CLIENTS,
  REGISTRY_GRAPH_CLIENTS,
  STAKING_GRAPH_CLIENTS,
} from 'common-util/graphql/client';
import {
  dailyBabydegenPerformancesQuery,
  dailyBabydegenPopulationMetricsLatest7Query,
  dailyStakingGlobalsSnapshotsQuery,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import tokens from 'data/tokens.json';

const MIN_TOTAL_TRACES = 2;

const OLAS_ADDRESS = tokens
  .find((item) => item.key === 'optimism')
  ?.address?.toLowerCase();
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const COINGECKO_OLAS_IN_USD_PRICE_URL = OLAS_ADDRESS
  ? `https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd${COINGECKO_API_KEY ? `&x_cg_demo_api_key=${COINGECKO_API_KEY}` : ''}`
  : null;

// Cache for historical OLAS prices
const priceCache = new Map();

const formatDateForCoingecko = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-GB').replace(/\//g, '-');
};

const fetchPriceWithRetry = async (url, dateStr) => {
  const response = await fetch(url);
  const data = await response.json();

  if (data.status?.error_code === 429) {
    console.warn(`[${dateStr}] Rate limited, waiting 30 seconds...`);
    await new Promise((resolve) => setTimeout(resolve, 30000));
    return fetchPriceWithRetry(url, dateStr);
  }

  return data.market_data?.current_price?.usd;
};

const fetchOlasPriceForDate = async (timestamp) => {
  if (priceCache.has(timestamp)) {
    return priceCache.get(timestamp);
  }

  const dateStr = formatDateForCoingecko(timestamp);
  const url = `https://api.coingecko.com/api/v3/coins/autonolas/history?date=${dateStr}&localization=false${COINGECKO_API_KEY ? `&x_cg_demo_api_key=${COINGECKO_API_KEY}` : ''}`;

  try {
    const price = await fetchPriceWithRetry(url, dateStr);
    if (price !== undefined && price !== null && !isNaN(price)) {
      priceCache.set(timestamp, price);
      return price;
    }
  } catch (error) {
    console.warn(`[${dateStr}] Error fetching price:`, error.message);
  }

  const fallback = await fetchOlasUsdPrice();
  priceCache.set(timestamp, fallback);
  return fallback;
};

const fetchModiusPerformance = async () => {
  const agentName = 'Modius';
  try {
    const client = await Client.connect(
      `valory/${agentName}-Agent-Performance`,
    );
    const result = await client.predict('/refresh_apr_data', {});

    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < MIN_TOTAL_TRACES) {
      throw new Error(`Not enough data traces found for ${agentName}`);
    }

    const avgApr = traces[totalTraces - 1]?.y;
    const ethAdjustedApr = traces[totalTraces - 2]?.y;

    const latestEthApr = ethAdjustedApr[ethAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    return { latestAvgApr, latestEthApr };
  } catch (error) {
    console.error(`Error fetching APR values for ${agentName}:`, error);
    return null;
  }
};

const fetchOlasApr = async () => {
  try {
    const [modiusContractsResult, optimusContractsResult] =
      await Promise.allSettled([
        STAKING_GRAPH_CLIENTS.mode.request(
          stakingContractsQuery(MODIUS_STAKING_CONTRACTS),
        ),
        STAKING_GRAPH_CLIENTS.optimism.request(
          stakingContractsQuery(OPTIMUS_STAKING_CONTRACTS),
        ),
      ]);

    const modiusContracts =
      modiusContractsResult.status === 'fulfilled'
        ? modiusContractsResult.value.stakingContracts
        : null;
    const optimusContracts =
      optimusContractsResult.status === 'fulfilled'
        ? optimusContractsResult.value.stakingContracts
        : null;

    return {
      modius: modiusContracts ? getMaxApr(modiusContracts) : null,
      optimus: optimusContracts ? getMaxApr(optimusContracts) : null,
    };
  } catch (error) {
    console.error('Error fetching OLAS APRs:', error);
    return {
      modius: null,
      optimus: null,
    };
  }
};

const fetchOlasUsdPrice = async () => {
  if (!COINGECKO_OLAS_IN_USD_PRICE_URL || !OLAS_ADDRESS) {
    return 0;
  }
  try {
    const response = await fetch(COINGECKO_OLAS_IN_USD_PRICE_URL);
    if (!response.ok) return 0;
    const json = await response.json();
    const price = Number(json?.[OLAS_ADDRESS]?.usd || 0);
    return Number.isFinite(price) ? price : 0;
  } catch (error) {
    console.error('Error fetching OLAS USD price:', error);
    return 0;
  }
};

const fetchOptimusPopulationMetrics = async () => {
  try {
    const result = await BABYDEGEN_GRAPH_CLIENTS.optimism.request(
      dailyBabydegenPopulationMetricsLatest7Query,
    );
    const rows = Array.isArray(result?.dailyPopulationMetrics)
      ? result.dailyPopulationMetrics
      : [];
    if (rows.length === 0) return null;

    // Exclude today (UTC) - same logic as the script
    const todayMidnightUtc = Math.floor(Date.now() / 1000 / 86400) * 86400;
    const filtered = rows.filter((r) => Number(r.timestamp) < todayMidnightUtc);
    if (filtered.length < 7) return null;

    // Map medianAUM to medianFundedAUM
    const processedRows = filtered.slice(0, 7).map((row) => ({
      ...row,
      medianFundedAUM: toNumber(row.medianAUM),
    }));

    return processedRows.reverse();
  } catch (error) {
    console.error('Error fetching Optimus population metrics:', error);
    return null;
  }
};

const fetchOptimusMetrics = async () => {
  const [populationResult, stakingResult, olasUsdPriceResult] =
    await Promise.allSettled([
      fetchOptimusPopulationMetrics(),
      fetchOptimismStakingSnapshots(),
      fetchOlasUsdPrice(),
    ]);

  if (populationResult.status !== 'fulfilled') {
    console.error(
      'Optimus population metrics fetch failed:',
      populationResult.reason,
    );
    return null;
  }

  const populationMetrics = populationResult.value;
  const defaultMetrics = {
    latestUsdcApr: null,
    latestEthApr: null,
    stakingAprCalculated: null,
  };

  if (!populationMetrics || populationMetrics.length === 0) {
    return defaultMetrics;
  }

  const latest = populationMetrics[populationMetrics.length - 1];
  const baseMetrics = {
    latestUsdcApr: toNumber(latest?.sma7dProjectedUnrealisedPnL),
    latestEthApr: toNumber(latest?.sma7dEthAdjustedProjectedUnrealisedPnL),
    stakingAprCalculated: null,
  };

  if (stakingResult.status !== 'fulfilled') {
    console.error(
      'Optimism staking snapshots fetch failed:',
      stakingResult.reason,
    );
    return baseMetrics;
  }

  const stakingSnapshots = stakingResult.value;
  if (!stakingSnapshots || stakingSnapshots.length === 0) {
    return baseMetrics;
  }

  const olasUsdPrice =
    olasUsdPriceResult.status === 'fulfilled' ? olasUsdPriceResult.value : 0;
  if (olasUsdPriceResult.status !== 'fulfilled') {
    console.error('OLAS USD price fetch failed:', olasUsdPriceResult.reason);
  }

  const stakingApr = await calculateOptimusStakingApr({
    metrics: populationMetrics,
    stakingSnapshots,
  });

  return {
    ...baseMetrics,
    stakingAprCalculated: Number.isFinite(stakingApr) ? stakingApr : null,
  };
};

const fetchOptimismStakingSnapshots = async () => {
  try {
    const result = await STAKING_GRAPH_CLIENTS.optimism.request(
      dailyStakingGlobalsSnapshotsQuery,
    );
    const rows = Array.isArray(result?.cumulativeDailyStakingGlobals)
      ? result.cumulativeDailyStakingGlobals
      : [];

    if (rows.length === 0) return null;

    // Exclude today (UTC) - same logic as the script
    const todayMidnightUtc = Math.floor(Date.now() / 1000 / 86400) * 86400;
    const filtered = rows.filter((r) => Number(r.timestamp) < todayMidnightUtc);
    if (filtered.length < 7) return null;

    const reversed = filtered.slice(0, 7).reverse();

    // Pad with last known value if we have fewer than 8 snapshots (for delta calculation)
    while (reversed.length < 8) {
      const last = reversed[reversed.length - 1];
      reversed.push({
        timestamp: String(Number(last.timestamp) + 86400),
        medianCumulativeRewards: last.medianCumulativeRewards,
        numServices: last.numServices,
      });
    }

    return reversed;
  } catch (error) {
    console.error('Error fetching Optimism staking snapshots:', error);
    return null;
  }
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Calculates combined daily ROIs by combining agent performance with staking rewards.
 * Uses cumulative staking rewards with historical OLAS prices.
 * Returns array of daily combined ROI values (agent performance + staking rewards).
 */
const calculateCombinedDailyROIs = async (metrics, stakingTotals) => {
  const stakingByTimestamp = new Map();
  stakingTotals.forEach((staking) => {
    stakingByTimestamp.set(staking.timestamp, staking);
  });

  const combinedRois = [];
  let lastStakingRoi = 0;

  for (let dayIndex = 0; dayIndex < metrics.length; dayIndex += 1) {
    const metric = metrics[dayIndex];
    const staking = stakingByTimestamp.get(metric.timestamp);

    let stakingRoi = lastStakingRoi;

    if (staking) {
      // Fetch historical price for this specific day
      const historicalPrice = await fetchOlasPriceForDate(metric.timestamp);

      const medianRewardsOlas =
        Number(BigInt(staking.medianCumulativeRewards)) / 1e18;
      const medianRewardsUsd = medianRewardsOlas * historicalPrice;
      const medianFundedAum = toNumber(metric.medianFundedAUM);

      stakingRoi =
        medianFundedAum > 0 ? (medianRewardsUsd / medianFundedAum) * 100 : 0;
      lastStakingRoi = stakingRoi;
    }

    const agentRoi = toNumber(metric.medianUnrealisedPnL);
    const combinedRoi = agentRoi + stakingRoi;
    combinedRois.push(combinedRoi);
  }

  return combinedRois;
};

/**
 * Calculates Simple Moving Average (SMA) over a specified window.
 * Takes the most recent 'window' values and returns their average.
 */
const calculateSma = (values, window = 7) => {
  if (!Array.isArray(values) || values.length < window) return null;
  const subset = values.slice(-window);
  const sum = subset.reduce((accumulator, value) => accumulator + value, 0);
  return sum / window;
};

/**
 * Calculates annualized APR for Optimus staking by combining agent performance and staking rewards.
 * Process:
 * 1. Compute daily combined ROIs (agent trading + staking rewards) using historical prices
 * 2. Calculate 7-day SMA of those ROIs
 * 3. Normalize by average agent age (days active)
 * 4. Annualize by multiplying by 365
 * Returns the final APR percentage.
 */
const calculateOptimusStakingApr = async ({ metrics, stakingSnapshots }) => {
  if (!metrics || !stakingSnapshots) return null;

  const combined = await calculateCombinedDailyROIs(metrics, stakingSnapshots);
  if (!combined) return null;

  const sma = calculateSma(combined, 7);
  if (sma === null) return null;

  const latestMetric = metrics[metrics.length - 1];
  const averageAge = toNumber(latestMetric?.averageAgentDaysActive);
  const annualizationFactor = averageAge > 0 ? sma / averageAge : 0;

  return annualizationFactor * 365;
};

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  try {
    const [modeResult, optimismResult] = await Promise.all([
      REGISTRY_GRAPH_CLIENTS.mode.request(dailyBabydegenPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
      REGISTRY_GRAPH_CLIENTS.optimism.request(dailyBabydegenPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
    ]);

    const modePerformances = modeResult.dailyAgentPerformances ?? [];
    const optimismPerformances = optimismResult.dailyAgentPerformances ?? [];

    const modeAverage = calculate7DayAverage(
      modePerformances,
      'activeMultisigCount',
    );
    const optimismAverage = calculate7DayAverage(
      optimismPerformances,
      'activeMultisigCount',
    );

    const average = modeAverage + optimismAverage;

    return average;
  } catch (error) {
    console.error('Error fetching babydegen daily agent performances:', error);
    return null;
  }
};

const fetchAllAgentMetrics = async () => {
  try {
    const [
      modiusPerformanceResult,
      optimusMetricsResult,
      olasAprResult,
      dailyActiveAgentsResult,
    ] = await Promise.allSettled([
      fetchModiusPerformance(),
      fetchOptimusMetrics(),
      fetchOlasApr(),
      fetchDailyAgentPerformance(),
    ]);

    let optimusData = null;
    let modiusData = null;
    let dailyActiveAgentsData = null;

    if (modiusPerformanceResult.status === 'fulfilled') {
      modiusData = modiusPerformanceResult.value;
    } else {
      console.error(
        'Modius data fetch failed:',
        modiusPerformanceResult.reason,
      );
    }

    if (optimusMetricsResult.status === 'fulfilled') {
      optimusData = optimusMetricsResult.value;
    } else {
      console.error(
        'Optimus metrics fetch failed:',
        optimusMetricsResult.reason,
      );
    }

    if (olasAprResult.status === 'fulfilled') {
      if (optimusData) {
        optimusData.maxOlasApr = olasAprResult.value.optimus;
      }
      if (modiusData) {
        modiusData.maxOlasApr = olasAprResult.value.modius;
      }
    }

    if (dailyActiveAgentsResult.status === 'fulfilled') {
      dailyActiveAgentsData = dailyActiveAgentsResult.value;
    } else {
      console.error(
        'Babydegen DAAs data fetch failed:',
        dailyActiveAgentsResult.reason,
      );
    }

    const data = {
      data: {
        optimus: optimusData,
        modius: modiusData,
        dailyActiveAgents: dailyActiveAgentsData,
      },
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching babydegen metrics:', error);
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

    return res
      .status(404)
      .json({ error: 'Not enough data traces found for one or more agents.' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch agent performance values.' });
  }
}
