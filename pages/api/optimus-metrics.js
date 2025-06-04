import { Client } from '@gradio/client';

const MIN_TOTAL_TRACES = 2;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await Client.connect('valory/Modius-Agent-Performance');
    const result = await client.predict('/refresh_apr_data', {});

    // Parse through plotly-structured response
    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < MIN_TOTAL_TRACES) {
      return res.status(404).json({ error: 'Not enough data traces found' });
    }

    // Extract the last two traces
    const avgApr = traces[totalTraces - 1]?.y;
    const ETHAdjustedApr = traces[totalTraces - 2]?.y;

    const latestETHApr = ETHAdjustedApr[ETHAdjustedApr.length - 1];
    const latestAvgApr = avgApr[avgApr.length - 1];

    return res.status(200).json({ latestAvgApr, latestETHApr });
  } catch (error) {
    console.error('Error fetching APR values:', error);
    return res.status(500).json({ error: 'Failed to fetch APR values' });
  }
}
