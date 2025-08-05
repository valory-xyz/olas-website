import { Client } from '@gradio/client';
import {
  MODIUS_STAKING_CONTRACTS,
  OPTIMUS_STAKING_CONTRACTS,
} from 'common-util/constants';
import { STAKING_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { stakingContractsQuery } from 'common-util/graphql/queries';
import { getMaxApr } from 'common-util/olasApr';

const MIN_TOTAL_TRACES = 2;
const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const fetchAgentPerformance = async (agentName) => {
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

const fetchAllAgentMetrics = async () => {
  try {
    const [optimusPerformanceResult, modiusPerformanceResult, olasAprResult] =
      await Promise.allSettled([
        fetchAgentPerformance('Optimus'),
        fetchAgentPerformance('Modius'),
        fetchOlasApr(),
      ]);

    let optimusData = null;
    let modiusData = null;

    // Process the results from Promise.allSettled
    if (optimusPerformanceResult.status === 'fulfilled') {
      optimusData = optimusPerformanceResult.value;
    } else {
      console.error(
        'Optimus data fetch failed:',
        optimusPerformanceResult.reason,
      );
    }

    if (modiusPerformanceResult.status === 'fulfilled') {
      modiusData = modiusPerformanceResult.value;
    } else {
      console.error(
        'Modius data fetch failed:',
        modiusPerformanceResult.reason,
      );
    }

    if (olasAprResult.status === 'fulfilled') {
      optimusData.maxOlasApr = olasAprResult.value.optimus;
      modiusData.maxOlasApr = olasAprResult.value.modius;
    }

    const data = {
      data: { optimus: optimusData, modius: modiusData },
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
