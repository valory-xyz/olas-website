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
  dailyStakingGlobalsLatest8Query,
  stakingContractsQuery,
} from 'common-util/graphql/queries';
import { getMaxApr } from 'common-util/olasApr';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import tokens from 'data/tokens.json';

const MIN_TOTAL_TRACES = 2;

const OLAS_ADDRESS = tokens
  .find((item) => item.key === 'optimism')
  ?.address?.toLowerCase();
const COINGECKO_OLAS_IN_USD_PRICE_URL = OLAS_ADDRESS
  ? `https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum?contract_addresses=${OLAS_ADDRESS}&vs_currencies=usd`
  : null;

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
    if (rows.length < 7) return null;
    return rows.slice().reverse();
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

  const stakingSnapshotsRaw = stakingResult.value;
  if (!stakingSnapshotsRaw || stakingSnapshotsRaw.length === 0) {
    return baseMetrics;
  }

  // Ensure we have at least 8 days by padding missing days with previous totals (0 delta)
  const stakingSnapshots = stakingSnapshotsRaw
    .slice()
    .reverse()
    .slice(-8)
    .map((s) => ({
      timestamp: Number(s.timestamp),
      totalRewards: s.totalRewards,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
  while (stakingSnapshots.length < 8) {
    const last = stakingSnapshots[stakingSnapshots.length - 1];
    stakingSnapshots.push({
      timestamp: last ? last.timestamp + 86400 : 0,
      totalRewards: last ? last.totalRewards : '0',
    });
  }

  const olasUsdPrice =
    olasUsdPriceResult.status === 'fulfilled' ? olasUsdPriceResult.value : 0;
  if (olasUsdPriceResult.status !== 'fulfilled') {
    console.error('OLAS USD price fetch failed:', olasUsdPriceResult.reason);
  }

  const stakingApr = calculateOptimusStakingApr({
    metrics: populationMetrics,
    stakingSnapshots,
    olasUsdPrice,
  });

  return {
    ...baseMetrics,
    stakingAprCalculated: Number.isFinite(stakingApr) ? stakingApr : null,
  };
};

const fetchOptimismStakingSnapshots = async () => {
  try {
    const result = await STAKING_GRAPH_CLIENTS.optimism.request(
      dailyStakingGlobalsLatest8Query,
    );
    const rows = Array.isArray(result?.dailyStakingGlobals)
      ? result.dailyStakingGlobals
      : [];
    if (rows.length < 8) return null;
    return rows.slice().reverse();
  } catch (error) {
    console.error('Error fetching Optimism staking snapshots:', error);
    return null;
  }
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const calculateDailyRoi = (metric, current, previous, olasUsdPrice) => {
  const currentTotal = BigInt(current?.totalRewards ?? 0);
  const previousTotal = BigInt(previous?.totalRewards ?? 0);
  if (currentTotal < previousTotal) return null;

  const cumulativeOlas = Number(currentTotal) / 1e18;
  const cumulativeUsd = cumulativeOlas * olasUsdPrice;
  const fundedAumUsd = toNumber(metric?.totalFundedAUM);
  const agentRoi = toNumber(metric?.medianUnrealisedPnL);
  const stakingRoi =
    fundedAumUsd > 0 ? (cumulativeUsd / fundedAumUsd) * 100 : 0;

  return agentRoi + stakingRoi;
};

const computeCombinedRois = (metrics, stakingSnapshots, olasUsdPrice) => {
  if (!metrics || !stakingSnapshots) return null;
  const startIndex = stakingSnapshots.length - metrics.length - 1;
  if (startIndex < 0) return null;

  const combined = [];
  for (let index = 0; index < metrics.length; index += 1) {
    const current = stakingSnapshots[startIndex + index + 1];
    const previous = stakingSnapshots[startIndex + index];
    const dailyRoi = calculateDailyRoi(
      metrics[index],
      current,
      previous,
      olasUsdPrice,
    );
    if (dailyRoi === null) return null;

    combined.push(dailyRoi);
  }

  return combined;
};

const calculateSma = (values, window = 7) => {
  if (!Array.isArray(values) || values.length < window) return null;
  const subset = values.slice(-window);
  const sum = subset.reduce((accumulator, value) => accumulator + value, 0);
  return sum / window;
};

const calculateOptimusStakingApr = ({
  metrics,
  stakingSnapshots,
  olasUsdPrice,
}) => {
  if (!metrics || !stakingSnapshots || !olasUsdPrice) return null;

  const combined = computeCombinedRois(metrics, stakingSnapshots, olasUsdPrice);
  if (!combined) return null;

  const sma = calculateSma(combined, 7);
  if (sma === null) return null;

  const latestMetric = metrics[metrics.length - 1];
  const averageAge = toNumber(latestMetric?.averageAgentDaysActive);
  const annualizationFactor = averageAge > 0 ? sma / averageAge : sma;

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
