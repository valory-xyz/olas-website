import { fetchAllAgentMetrics } from 'common-util/api/main-metrics';
import { parseFormattedCount, TXN_MILESTONE_VALUE } from 'common-util/constants';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

import type { MainMetricsData } from 'common-util/api/main-metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await fetchAllAgentMetrics();

    if (!metrics) {
      throw new Error('No metrics returned from fetchAllAgentMetrics');
    }

    // Temporary, for the 20M celebration: record when the threshold was first
    // crossed so the run can last a week from that moment rather than a date
    // guessed in advance. Stamped once — afterwards the key is absent from new
    // data, and the snapshot merge carries the original value forward.
    const previous = await getSnapshot({ category: 'main' });
    const alreadyStamped = (previous?.data as MainMetricsData | undefined)?.milestoneReachedAt;

    if (!alreadyStamped) {
      const transactions = parseFormattedCount(metrics.data?.transactions?.value);
      if (transactions >= TXN_MILESTONE_VALUE) {
        metrics.data.milestoneReachedAt = new Date().toISOString();
      }
    }

    const url = await saveSnapshot({ category: 'main', data: metrics });

    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      metrics,
    });
  } catch (error) {
    console.error('Error refreshing main metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
