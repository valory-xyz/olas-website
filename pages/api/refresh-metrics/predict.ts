import { fetchAllPredictMetrics } from 'common-util/api/predict-metrics';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const metrics = await fetchAllPredictMetrics();

    if (!metrics) {
      throw new Error('No predict metrics returned');
    }

    const url = await saveSnapshot({ category: 'predict', data: metrics });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
    });
  } catch (error) {
    console.error('Error refreshing predict metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
