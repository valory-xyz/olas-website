import { Client } from '@gradio/client';

const MIN_TOTAL_TRACES = 2;
const CACHE_DURATION_SECONDS = 24 * 60 * 60; // 86400 seconds = 24 hours

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

const fetchAllAgentMetrics = async () => {
  try {
    const [optimusResult, modiusResult] = await Promise.allSettled([
      fetchAgentPerformance('Optimus'),
      fetchAgentPerformance('Modius'),
    ]);

    let optimusData = null;
    let modiusData = null;

    // Process the results from Promise.allSettled
    if (optimusResult.status === 'fulfilled') {
      optimusData = optimusResult.value;
    } else {
      console.error('Optimus data fetch failed:', optimusResult.reason);
    }

    if (modiusResult.status === 'fulfilled') {
      modiusData = modiusResult.value;
    } else {
      console.error('Modius data fetch failed:', modiusResult.reason);
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
    `max-age=${CACHE_DURATION_SECONDS}`,
  );
  res.setHeader('CDN-Cache-Control', `max-age=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, max-age=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
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
