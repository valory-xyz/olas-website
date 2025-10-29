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
  dailyBabydegenPopulationMetricsQuery,
  dailyStakingGlobalsSnapshotsQuery,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import tokens from 'data/tokens.json';

const OLAS_ADDRESS = tokens
  .find((item) => item.key === 'optimism')
  ?.address?.toLowerCase();
const COINGECKO_OLAS_IN_USD_PRICE_URL = OLAS_ADDRESS
  ? `https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`
  : null;

// Hardcoded values for Modius , suggested by Babydegen team
const MODIUS_FIXED_END_DATE_UTC = '2025-09-18T00:00:00Z';
const MODIUS_FIXED_END_TIMESTAMP = Math.floor(
  new Date(MODIUS_FIXED_END_DATE_UTC).getTime() / 1000,
);
const MODIUS_FIXED_OLAS_PRICE_USD = 0.23; // olas price in USD on 2025-09-18
const EMPTY_APR_METRICS = {
  latestUsdcApr: null,
  latestEthApr: null,
  stakingAprCalculated: null,
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

const fetchModiusPopulationMetrics = async () => {
  try {
    const result = await BABYDEGEN_GRAPH_CLIENTS.mode.request(
      dailyBabydegenPopulationMetricsQuery({
        first: 7,
        timestampLte: MODIUS_FIXED_END_TIMESTAMP,
      }),
    );
    const rows = Array.isArray(result?.dailyPopulationMetrics)
      ? result.dailyPopulationMetrics
      : [];
    if (rows.length === 0) return null;

    if (rows.length < 7) {
      console.error('Not enough Modius population snapshots before cutoff.');
      return null;
    }

    const processed = rows.map((row) => ({
      ...row,
      medianFundedAUM: toNumber(row.medianAUM),
    }));

    return processed.reverse();
  } catch (error) {
    console.error('Error fetching Modius population metrics:', error);
    return null;
  }
};

const fetchModeStakingSnapshots = async () => {
  try {
    const result = await STAKING_GRAPH_CLIENTS.mode.request(
      dailyStakingGlobalsSnapshotsQuery({
        first: 7,
        timestampLte: MODIUS_FIXED_END_TIMESTAMP,
      }),
    );
    const rows = Array.isArray(result?.cumulativeDailyStakingGlobals)
      ? result.cumulativeDailyStakingGlobals
      : [];
    if (rows.length === 0) return null;

    if (rows.length < 7) {
      console.error('Not enough Modius staking snapshots before cutoff.');
      return null;
    }

    return rows.reverse();
  } catch (error) {
    console.error('Error fetching Modius staking snapshots:', error);
    return null;
  }
};

const fetchOptimusPopulationMetrics = async () => {
  try {
    const result = await BABYDEGEN_GRAPH_CLIENTS.optimism.request(
      dailyBabydegenPopulationMetricsQuery({ first: 10 }),
    );
    const rows = Array.isArray(result?.dailyPopulationMetrics)
      ? result.dailyPopulationMetrics
      : [];
    if (rows.length === 0) return null;

    // Exclude today (UTC) 
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

const fetchOptimusMetrics = async (olasUsdPricePromise) => {
  const [populationResult, stakingResult, olasUsdPriceResult] =
    await Promise.allSettled([
      fetchOptimusPopulationMetrics(),
      fetchOptimismStakingSnapshots(),
      olasUsdPricePromise ?? fetchOlasUsdPrice(),
    ]);

  if (populationResult.status !== 'fulfilled') {
    console.error(
      'Optimus population metrics fetch failed:',
      populationResult.reason,
    );
    return null;
  }

  const populationMetrics = populationResult.value;
  const olasUsdPrice =
    olasUsdPriceResult.status === 'fulfilled' ? olasUsdPriceResult.value : 0;
  if (olasUsdPriceResult.status !== 'fulfilled') {
    console.error('OLAS USD price fetch failed:', olasUsdPriceResult.reason);
  }

  const stakingSnapshots =
    stakingResult.status === 'fulfilled' ? stakingResult.value : null;
  if (stakingResult.status !== 'fulfilled') {
    console.error(
      'Optimism staking snapshots fetch failed:',
      stakingResult.reason,
    );
  }

  const metrics = buildAprMetrics({
    populationMetrics,
    stakingSnapshots,
    olasUsdPrice,
  });

  return metrics ?? { ...EMPTY_APR_METRICS };
};

const fetchModiusMetrics = async () => {
  const [populationResult, stakingResult] = await Promise.allSettled([
    fetchModiusPopulationMetrics(),
    fetchModeStakingSnapshots(),
  ]);

  if (populationResult.status !== 'fulfilled') {
    console.error(
      'Modius population metrics fetch failed:',
      populationResult.reason,
    );
    return null;
  }

  const populationMetrics = populationResult.value;
  const olasUsdPrice = MODIUS_FIXED_OLAS_PRICE_USD;

  const stakingSnapshots =
    stakingResult.status === 'fulfilled' ? stakingResult.value : null;
  if (stakingResult.status !== 'fulfilled') {
    console.error('Mode staking snapshots fetch failed:', stakingResult.reason);
  }

  const aprMetrics = buildAprMetrics({
    populationMetrics,
    stakingSnapshots,
    olasUsdPrice,
  });

  if (!aprMetrics) {
    return {
      ...EMPTY_APR_METRICS,
      latestAvgApr: null,
    };
  }

  return {
    ...aprMetrics,
    latestAvgApr: aprMetrics.latestUsdcApr,
  };
};

const fetchOptimismStakingSnapshots = async () => {
  try {
    const result = await STAKING_GRAPH_CLIENTS.optimism.request(
      dailyStakingGlobalsSnapshotsQuery({ first: 10 }),
    );
    const rows = Array.isArray(result?.cumulativeDailyStakingGlobals)
      ? result.cumulativeDailyStakingGlobals
      : [];

    if (rows.length === 0) return null;

    // Exclude today (UTC) 
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
 * Uses a single OLAS USD price snapshot for all staking reward conversions.
 * Returns array of daily combined ROI values (agent performance + staking rewards).
 */
const calculateCombinedDailyROIs = (metrics, stakingTotals, olasUsdPrice) => {
  if (!Array.isArray(metrics) || metrics.length === 0) return null;
  if (!Array.isArray(stakingTotals) || stakingTotals.length === 0) return null;

  const stakingByTimestamp = new Map();
  stakingTotals.forEach((staking) => {
    stakingByTimestamp.set(staking.timestamp, staking);
  });

  const combinedRois = [];
  let lastStakingRoi = 0;

  metrics.forEach((metric) => {
    const staking = stakingByTimestamp.get(metric.timestamp);
    let stakingRoi = lastStakingRoi;

    if (staking && olasUsdPrice > 0) {
      const medianRewardsOlas =
        Number(BigInt(staking.medianCumulativeRewards)) / 1e18;
      const medianRewardsUsd = medianRewardsOlas * olasUsdPrice;
      const medianFundedAum = toNumber(metric.medianFundedAUM);

      stakingRoi =
        medianFundedAum > 0 ? (medianRewardsUsd / medianFundedAum) * 100 : 0;
      lastStakingRoi = stakingRoi;
    }

    const agentRoi = toNumber(metric.medianUnrealisedPnL);
    combinedRois.push(agentRoi + stakingRoi);
  });

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
 * Calculates annualized APR by combining agent performance and staking rewards.
 * Process:
 * 1. Compute daily combined ROIs (agent trading + staking rewards) using the shared OLAS USD price snapshot
 * 2. Calculate 7-day SMA of those ROIs
 * 3. Normalize by average agent age (days active)
 * 4. Annualize by multiplying by 365
 * Returns the final APR percentage.
 */
const calculateStakingApr = ({ metrics, stakingSnapshots, olasUsdPrice }) => {
  if (!metrics || !stakingSnapshots) return null;

  const combined = calculateCombinedDailyROIs(
    metrics,
    stakingSnapshots,
    olasUsdPrice,
  );
  if (!combined) return null;

  const sma = calculateSma(combined, 7);
  if (sma === null) return null;

  const latestMetric = metrics[metrics.length - 1];
  const averageAge = toNumber(latestMetric?.averageAgentDaysActive);
  const annualizationFactor = averageAge > 0 ? sma / averageAge : 0;

  return annualizationFactor * 365;
};

const buildAprMetrics = ({
  populationMetrics,
  stakingSnapshots,
  olasUsdPrice,
}) => {
  if (!Array.isArray(populationMetrics) || populationMetrics.length === 0) {
    return null;
  }

  const latest = populationMetrics[populationMetrics.length - 1];
  const latestUsdcApr = toNumber(latest?.sma7dProjectedUnrealisedPnL);
  const latestEthApr = toNumber(latest?.sma7dEthAdjustedProjectedUnrealisedPnL);

  if (!Array.isArray(stakingSnapshots) || stakingSnapshots.length === 0) {
    return {
      latestUsdcApr,
      latestEthApr,
      stakingAprCalculated: null,
    };
  }

  const stakingApr = calculateStakingApr({
    metrics: populationMetrics,
    stakingSnapshots,
    olasUsdPrice,
  });

  return {
    latestUsdcApr,
    latestEthApr,
    stakingAprCalculated: Number.isFinite(stakingApr) ? stakingApr : null,
  };
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
    const olasUsdPricePromise = fetchOlasUsdPrice();
    const [
      modiusMetricsResult,
      optimusMetricsResult,
      olasAprResult,
      dailyActiveAgentsResult,
    ] = await Promise.allSettled([
      fetchModiusMetrics(),
      fetchOptimusMetrics(olasUsdPricePromise),
      fetchOlasApr(),
      fetchDailyAgentPerformance(),
    ]);

    let optimusData = null;
    let modiusData = null;
    let dailyActiveAgentsData = null;

    if (modiusMetricsResult.status === 'fulfilled') {
      modiusData = modiusMetricsResult.value;
    } else {
      console.error('Modius data fetch failed:', modiusMetricsResult.reason);
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
