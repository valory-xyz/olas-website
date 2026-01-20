import { fetchAllOtherMetrics } from 'common-util/api/other-metrics';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await fetchAllOtherMetrics();
    const url = await saveSnapshot({ category: 'other', data: metrics });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      metrics,
    });
  } catch (error) {
    console.error('Error refreshing other metrics:', error);
    return res.status(500).json({ error: 'Failed to refresh other metrics.' });
  }
}
