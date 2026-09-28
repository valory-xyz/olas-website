import {
  backfillRoiHistory,
  updateOmenstratData,
  updatePolystratData,
} from 'common-util/api/predict/roi-distribution';
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
  // ?rebuildMech=1 drops only the mech-analytics watermark, so this run
  // refetches the full QMR window while ingestedRequestIds keeps suppressing
  // rows that were already counted (a wiped id set would double-book already-
  // matched requests). Read docs/predict-roi-accounting.md before using.
  const rebuildMech = req.query.rebuildMech === '1';

  // ?backfillHistory=1 is the one-off 365D history replay. Progress is kept in its own
  // blob between calls; byDay is written once, when the replay finishes, and only for
  // days older than the live data. Repeat while remainingDays > 0. Keep it off the
  // daily cron's minute — both overwrite the main blob.
  if (req.query.backfillHistory === '1') {
    const stateCategory = `roi-distribution/${agent}-history-replay`;
    try {
      const [existing, existingState] = await Promise.all([
        getSnapshot({ category: mainCategory }),
        getSnapshot({ category: stateCategory }),
      ]);
      if (!existing?.data) {
        return res.status(409).json({ success: false, message: `No ${mainCategory} blob yet` });
      }
      const { mainData, state, ok, remainingDays } = await backfillRoiHistory(
        agent,
        existing.data as any,
        (existingState?.data as any) ?? null
      );
      await saveSnapshot({
        category: stateCategory,
        data: { data: state, timestamp: Date.now() },
        overwrite: true,
      });
      if (mainData) {
        await saveSnapshot({
          category: mainCategory,
          // Keep the live run's timestamp: the blob's age is what the staleness check reads.
          data: { data: mainData, timestamp: existing.timestamp },
          overwrite: true,
        });
      }
      return res.status(ok ? 200 : 500).json({
        success: ok,
        remainingDays,
        replayedTo: state ? new Date(state.cursor * 1000).toISOString().slice(0, 10) : null,
        historyFrom: mainData?.historyFrom
          ? new Date(mainData.historyFrom * 1000).toISOString().slice(0, 10)
          : null,
      });
    } catch (error) {
      console.error(`Error backfilling ${agent} ROI history:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  try {
    const [existing, existingQmr] = await Promise.all([
      getSnapshot({ category: mainCategory }),
      getSnapshot({ category: reqCategory }),
    ]);

    const qmrIn = (existingQmr?.data as any) ?? null;
    if (rebuildMech && qmrIn?.mechAnalytics) delete qmrIn.mechAnalytics.lastComputedAt;

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
