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
    // passes large windows: /api/refresh-metrics/explorer?accuracyPages=400&roiDays=365
    // Keep params under what fits the 300s function limit (≈ accuracyPages 400 / roiDays
    // 365) — if the invocation overruns it's killed before saveSnapshot and nothing is
    // written. Go deeper by re-running with larger windows (each run merges into prior).
    const previousSnapshot = await getSnapshot({ category: 'explorer' });
    const previousData = previousSnapshot?.data as ExplorerMetricsData | undefined;
    const previous = previousData?.omenstrat?.value ?? null;
    const mechPrevious = previousData?.mech?.value ?? null;

    // Mech ATA has no daily aggregate, so it's event-counted per day (Method A): the cron
    // recomputes only the last couple of days; a one-time history backfill pages a bounded
    // slice — keep each slice ≲150 days so it fits the 300s budget, e.g.:
    //   /api/refresh-metrics/explorer?ataFromDays=400&ataToDays=250  (then 250→100, 100→0)
    const metrics = await fetchAllExplorerMetrics({
      previous,
      accuracyPages: toInt(req.query.accuracyPages),
      roiDays: toInt(req.query.roiDays),
      mechPrevious,
      ataFromDays: toInt(req.query.ataFromDays),
      ataToDays: toInt(req.query.ataToDays),
    });

    if (!metrics) {
      throw new Error('No explorer metrics returned');
    }

    const url = await saveSnapshot({ category: 'explorer', data: metrics });

    const value = metrics.data.omenstrat.value;
    const optimus = metrics.data.babydegenOptimus.value;
    const modius = metrics.data.babydegenModius.value;
    const mech = metrics.data.mech.value;
    const seriesCounts = (s: { daa: unknown[]; transactions: unknown[]; aum?: unknown[] } | null) =>
      s && {
        daa: s.daa.length,
        transactions: s.transactions.length,
        ...(s.aum && { aum: s.aum.length }),
      };
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
      babydegenCounts: {
        optimus: seriesCounts(optimus),
        modius: seriesCounts(modius),
      },
      mechCounts: mech && {
        daa: mech.daa.length,
        ata: mech.ata.length,
        ataTotal: mech.ata.reduce((sum, p) => sum + p.count, 0),
      },
    });
  } catch (error) {
    console.error('Error refreshing explorer metrics:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
