import { ExplorerMetricsData, fetchAllExplorerMetrics } from 'common-util/api/explorer';
import { getSnapshot, saveSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

const toInt = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Accuracy/ROI fetch a recent window and merge into the prior stored series, so a
    // one-time deep backfill is preserved. Default (cron) = shallow window. A backfill
    // passes large windows: /api/refresh-metrics/explorer?accuracyPages=240&roiDays=365
    const previousSnapshot = await getSnapshot({ category: 'explorer' });
    const previous = (previousSnapshot?.data as ExplorerMetricsData)?.omenstrat?.value ?? null;

    const metrics = await fetchAllExplorerMetrics({
      previous,
      accuracyPages: toInt(req.query.accuracyPages),
      roiDays: toInt(req.query.roiDays),
    });

    if (!metrics) {
      throw new Error('No explorer metrics returned');
    }

    const url = await saveSnapshot({ category: 'explorer', data: metrics });

    const value = metrics.data.omenstrat.value;
    return res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      url,
      counts: value && {
        daa: value.daa.length,
        transactions: value.transactions.length,
        accuracy: value.accuracy.length,
        roi: value.roi.length,
      },
    });
  } catch (error) {
    console.error('Error refreshing explorer metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
