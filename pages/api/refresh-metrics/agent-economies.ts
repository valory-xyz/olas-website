import { fetchAllAgentEconomiesMetrics } from 'common-util/api/agent-economies';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const metrics = await fetchAllAgentEconomiesMetrics();

    if (!metrics) {
      throw new Error('No agent economies metrics returned');
    }

    const url = await saveSnapshot({
      category: 'agent-economies',
      data: metrics,
    });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
    });
  } catch (error) {
    console.error('Error refreshing agent economies metrics:', error);
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
}
