import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

const MIN_TOTAL_TRACES = 2;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FOLDER = path.join(process.cwd(), 'data', 'cache');
const CACHE_FILE_PATH = path.join(CACHE_FOLDER, 'babydegen-metrics-cache.json');

if (!fs.existsSync(CACHE_FOLDER)) {
  fs.mkdirSync(CACHE_FOLDER);
}

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
    const ETHAdjustedApr = traces[totalTraces - 2]?.y;

    const latestETHApr = ETHAdjustedApr[ETHAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    return { latestAvgApr, latestETHApr };
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

    // Save data to cache
    try {
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (writeError) {
      console.error('Error writing to cache:', writeError);
    }

    return data;
  } catch (error) {
    console.error('Error fetching babydegen metrics:', error);
    return null;
  }
};

const getCachedData = () => {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=43200`,
  );

  try {
    const cachedData = getCachedData();
    const now = Date.now();
    const isCacheExpired =
      !cachedData || now - cachedData.timestamp > CACHE_DURATION;

    if (isCacheExpired) {
      // Asynchronously update cache but return existing (potentially stale) data immediately
      fetchAllAgentMetrics().catch(console.error);

      // Returns cached data, even expired
      if (cachedData) {
        return res.status(200).json(cachedData.data);
      }
    } else {
      // Returns cached data
      return res.status(200).json(cachedData.data);
    }

    // If no cached data is available (first run or cache cleared),
    // fetch synchronously
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
