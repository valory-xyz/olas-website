import { computeAllToolAccuracy } from 'common-util/api/predict/tool-accuracy';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const toolAccuracy = await computeAllToolAccuracy();

    const url = await saveSnapshot({
      category: 'predict-tool-accuracy',
      data: { data: toolAccuracy, timestamp: Date.now() },
      overwrite: true,
    });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      toolAccuracy,
    });
  } catch (error) {
    console.error('Error refreshing predict tool accuracy:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
