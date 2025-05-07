import { Client } from '@gradio/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200',
  );

  try {
    const client = await Client.connect('valory/Modius-Agent-Performance');

    const result = await client.predict('/refresh_graph', {});
    const plotString = result.data[0].plot;
    const plotData = JSON.parse(plotString);

    const traces = plotData.data;
    const totalTraces = traces.length;

    if (totalTraces < 2) {
      return res.status(404).json({ error: 'Not enough data traces found' });
    }

    const ETHAdjustedAPR = traces[totalTraces - 1]?.y;
    const avgAPR = traces[totalTraces - 2]?.y;

    const latestETHAPR = ETHAdjustedAPR[ETHAdjustedAPR.length - 1];
    const latestAvgAPR = avgAPR[avgAPR.length - 1];

    return res.status(200).json({
      latestAvgAPR: latestAvgAPR,
      latestETHAPR: latestETHAPR,
    });
  } catch (error) {
    console.error('Error fetching APR values:', error);
    return res.status(500).json({ error: 'Failed to fetch APR values' });
  }
}
