import { updateOmenstratData, updatePolystratData } from 'common-util/api/predict/roi-distribution';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { agent } = req.query;

  if (!agent || (agent !== 'omenstrat' && agent !== 'polystrat')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing agent parameter. Expected "omenstrat" or "polystrat".',
    });
  }

  const updateFn = agent === 'omenstrat' ? updateOmenstratData : updatePolystratData;
  const mainCategory = `roi-distribution/${agent}-main`;
  const reqCategory = `roi-distribution/${agent}-requests`;
  // ?rebuildMech=1 drops the mech-analytics watermark, so this run re-ingests
  // the full QMR window (merged and deduped into the open set). Read the
  // rebuild caveats in docs/predict-roi-accounting.md before using.
  const rebuildMech = req.query.rebuildMech === '1';

  try {
    const [existing, existingQmr] = await Promise.all([
      getSnapshot({ category: mainCategory }),
      getSnapshot({ category: reqCategory }),
    ]);

    const qmrIn = (existingQmr?.data as any) ?? null;
    if (rebuildMech && qmrIn) delete qmrIn.mechAnalytics;

    const { mainData, qmrData } = await updateFn((existing?.data as any) ?? null, qmrIn);

    const [url] = await Promise.all([
      saveSnapshot({
        category: mainCategory,
        data: { data: mainData, timestamp: Date.now() },
        overwrite: true,
      }),
      saveSnapshot({
        category: reqCategory,
        data: { data: qmrData, timestamp: Date.now() },
        overwrite: true,
      }),
    ]);

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      fetchErrors: mainData.fetchErrors ?? [],
      mechAttribution: mainData.mechAttribution,
    });
  } catch (error) {
    console.error(`Error refreshing ${agent} ROI distribution:`, error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
