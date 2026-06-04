import { fetchAllExplorerMetrics } from 'common-util/api/explorer';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await fetchAllExplorerMetrics();

    if (!metrics) {
      throw new Error('No explorer metrics returned');
    }

    const url = await saveSnapshot({ category: 'explorer', data: metrics });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      metrics,
    });
  } catch (error) {
    console.error('Error refreshing explorer metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
