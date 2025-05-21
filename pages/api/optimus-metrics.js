import { Client } from '@gradio/client';

const MIN_TOTAL_TRACES = 2;

let cachedResponse = null;
let isFetching = false;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200',
  );

  if (cachedResponse && !isFetching) {
    return res.status(200).json(cachedResponse);
  }

  if (isFetching) {
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }

  try {
    isFetching = true;
    const client = await Client.connect('valory/Modius-Agent-Performance');

    const result = await client.predict('/refresh_apr_data', {});

    // Parse through plotly-structured response
    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < MIN_TOTAL_TRACES) {
      isFetching = false;
      return res.status(404).json({ error: 'Not enough data traces found' });
    }

    // Extract the last two traces, which are consistently structured as:
    // - Second last: ETH-adjusted APR average
    // - Last: overall APR average
    const avgApr = traces[totalTraces - 1]?.y;
    const ETHAdjustedApr = traces[totalTraces - 2]?.y;

    const latestETHApr = ETHAdjustedApr[ETHAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    const response = {
      latestAvgApr: latestAvgApr,
      latestETHApr: latestETHApr,
    };

    cachedResponse = response;
    isFetching = false;

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching APR values:', error);
    isFetching = false;
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }
    return res.status(500).json({ error: 'Failed to fetch APR values' });
  }
}
