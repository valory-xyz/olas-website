import { updateOmenstratData } from 'common-util/api/predict/roi-distribution';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [existing, existingQmr] = await Promise.all([
      getSnapshot({ category: 'roi-distribution/omenstrat-main' }),
      getSnapshot({ category: 'roi-distribution/omenstrat-requests' }),
    ]);

    const { mainData, qmrData } = await updateOmenstratData(
      (existing?.data as any) ?? null,
      (existingQmr?.data as any) ?? null
    );

    const [url] = await Promise.all([
      saveSnapshot({
        category: 'roi-distribution/omenstrat-main',
        data: { data: mainData, timestamp: Date.now() },
      }),
      saveSnapshot({
        category: 'roi-distribution/omenstrat-requests',
        data: { data: qmrData, timestamp: Date.now() },
      }),
    ]);

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
    });
  } catch (error) {
    console.error('Error refreshing Omenstrat ROI distribution:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
