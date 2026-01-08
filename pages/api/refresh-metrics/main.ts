import { fetchAllAgentMetrics } from 'common-util/api/main-metrics';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await fetchAllAgentMetrics();

    if (!metrics) {
      throw new Error('No metrics returned from fetchAllAgentMetrics');
    }

    const url = await saveSnapshot({ category: 'main', data: metrics });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
    });
  } catch (error) {
    console.error('Error refreshing main metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
