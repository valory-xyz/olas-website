import {
  OMENSTRAT_PAYOUT_OVERRIDES_ENABLED,
  OmenstratPayoutsData,
  updatePayoutOverrides,
} from 'common-util/api/predict/omenstrat-payout-overrides'; // TEMPORARY
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

  try {
    const [existing, existingQmr] = await Promise.all([
      getSnapshot({ category: mainCategory }),
      getSnapshot({ category: reqCategory }),
    ]);

    const { mainData, qmrData } = await updateFn(
      (existing?.data as any) ?? null,
      (existingQmr?.data as any) ?? null
    );

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

    // TEMPORARY: update payout overrides from chain logs for omenstrat subgraph bug workaround
    if (agent === 'omenstrat' && OMENSTRAT_PAYOUT_OVERRIDES_ENABLED) {
      const existingPayoutsOverridesSnapshot = await getSnapshot({
        category: 'roi-distribution/omenstrat-payouts',
      });
      const existingData = (existingPayoutsOverridesSnapshot?.data ??
        null) as unknown as OmenstratPayoutsData | null;
      const updatedData = await updatePayoutOverrides(existingData);
      await saveSnapshot({
        category: 'roi-distribution/omenstrat-payouts',
        data: { data: updatedData, timestamp: Date.now() },
        overwrite: true,
      });
    }

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
    });
  } catch (error) {
    console.error(`Error refreshing ${agent} ROI distribution:`, error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
