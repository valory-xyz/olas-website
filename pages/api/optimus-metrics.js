import { Client } from '@gradio/client';

const MIN_TOTAL_TRACES = 2;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

let cachedResponse = null;
let isFetching = false;

async function fetchNewData() {
  try {
    const client = await Client.connect('valory/Modius-Agent-Performance');
    const result = await client.predict('/refresh_apr_data', {});

    // Parse through plotly-structured response
    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < MIN_TOTAL_TRACES) {
      return null;
    }

    // Extract the last two traces, which are consistently structured as:
    // - Second last: ETH-adjusted APR average
    // - Last: overall APR average
    const avgApr = traces[totalTraces - 1]?.y;
    const ETHAdjustedApr = traces[totalTraces - 2]?.y;

    const latestETHApr = ETHAdjustedApr[ETHAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    return {
      data: {
        latestAvgApr: latestAvgApr,
        latestETHApr: latestETHApr,
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching APR values:', error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200',
  );

  const now = Date.now();
  const isCacheExpired =
    cachedResponse && now - cachedResponse.timestamp > CACHE_DURATION;

  if (isCacheExpired && !isFetching) {
    isFetching = true;
    fetchNewData()
      .then((newData) => {
        if (newData) {
          cachedResponse = newData;
        }
        isFetching = false;
      })
      .catch(() => {
        isFetching = false;
      });
  }

  // Always returns available cached data
  if (cachedResponse) {
    return res.status(200).json(cachedResponse.data);
  }

  if (!cachedResponse) {
    try {
      const newData = await fetchNewData();
      if (newData) {
        cachedResponse = newData;
        return res.status(200).json(cachedResponse.data);
      }
      return res.status(404).json({ error: 'Not enough data traces found' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch APR values' });
    }
  }

  return res.status(503).json({ error: 'Service temporarily unavailable' });
}
