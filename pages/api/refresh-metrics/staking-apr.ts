import { fetchAllStakingAprs, STAKING_APR_CATEGORY } from 'common-util/api/staking-apr';
import { saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await fetchAllStakingAprs();

    if (!metrics) {
      throw new Error('No metrics returned from fetchAllStakingAprs');
    }

    // The builder merges with the previous snapshot itself (accumulated history).
    const url = await saveSnapshot({
      category: STAKING_APR_CATEGORY,
      data: metrics,
      overwrite: true,
    });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      metrics,
    });
  } catch (error) {
    console.error('Error refreshing staking APR metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
