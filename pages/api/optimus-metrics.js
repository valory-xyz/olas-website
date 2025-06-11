import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

const MIN_TOTAL_TRACES = 2;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE_PATH = path.join(
  process.cwd(),
  'data',
  'optimus-metrics-cache.json',
);

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

const fetchLatestMetric = async () => {
  try {
    const client = await Client.connect('valory/Modius-Agent-Performance');
    const result = await client.predict('/refresh_apr_data', {});

    // Parse through plotly-structured response
    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < MIN_TOTAL_TRACES) {
      throw new Error('Not enough data traces found');
    }

    // Extract the last two traces
    const avgApr = traces[totalTraces - 1]?.y;
    const ETHAdjustedApr = traces[totalTraces - 2]?.y;

    const latestETHApr = ETHAdjustedApr[ETHAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    const data = {
      data: { latestAvgApr, latestETHApr },
      timestamp: Date.now(),
    };

    // Save to cache file
    try {
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (writeError) {
      console.error('Error writing to cache:', writeError);
    }

    return data;
  } catch (error) {
    console.error('Error fetching APR values:', error);
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
      fetchLatestMetric().catch(console.error);
    } else {
      return res.status(200).json(cachedData.data);
    }

    // If no cached data is available, fetch synchronously
    const latestMetric = await fetchLatestMetric();
    if (latestMetric) {
      return res.status(200).json(latestMetric.data);
    }

    return res.status(404).json({ error: 'Not enough data traces found' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch APR values' });
  }
}
