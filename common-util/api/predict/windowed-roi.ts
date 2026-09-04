import { DEFAULT_MECH_FEE } from 'common-util/constants';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';
import { getSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { emptyWindows, WindowedMetric, WindowKey } from './omenstrat-brier';
import { fetchOlasPriceInUsd } from './olas-price';
import { isLowMechAttribution } from './roi-math';
import { AgentBlueprintRoiData, computeWindowedNetGainAndCosts } from './roi-distribution';
import {
  fetchOmenstratStakingRewards,
  fetchPolystratStakingRewards,
  StakingRewardsWindows,
} from './staking-rewards';

const SCALE_1E18 = 10n ** 18n;
const DAY_SECONDS = 86400;

// The roi-distribution snapshot is refreshed by a separate daily cron. If that cron
// stalls the blob still loads, so guard on its age and surface staleness as a
// fetchError once it's older than this — otherwise windowed ROI would keep publishing
// aging data with a fresh-looking status.
const ROI_SNAPSHOT_MAX_AGE_MS = 48 * 60 * 60 * 1000;

const WINDOWS: { key: WindowKey; days: number | null }[] = [
  { key: '7d', days: 7 },
  { key: '30d', days: 30 },
  { key: '90d', days: 90 },
  { key: 'max', days: null },
];

// True when the last 7 full days settled trading volume with implausibly low
// booked mech cost (predict agents always pay mech fees before betting).
// Ratio decision + threshold live in roi-math.ts. `scale` lifts tradedSettled
// to 18 decimals (polystrat entries are USDC 1e6).
const hasLowMechAttribution = (data: AgentBlueprintRoiData, scale: bigint): boolean => {
  const yesterdayTs = getMidnightUtcTimestampDaysAgo(1);
  const cutoffTs = yesterdayTs - 6 * DAY_SECONDS;
  let mechRequests = 0;
  let settledCosts = 0n;
  for (const [dayKey, day] of Object.entries(data.byDay ?? {})) {
    const dayTs = Number(dayKey);
    if (dayTs < cutoffTs || dayTs > yesterdayTs) continue;
    for (const entry of Object.values(day.agents ?? {})) {
      mechRequests += entry.mechRequests;
      settledCosts += BigInt(entry.tradedSettled ?? '0') * scale;
    }
  }
  return isLowMechAttribution({ mechRequests, settledCosts, mechFeeWei: DEFAULT_MECH_FEE });
};

/** Polystrat entries are USDC (1e6); lift them to the 18 decimals the ratio assumes. */
const MECH_SCALE: Record<'omenstrat' | 'polystrat', bigint> = {
  omenstrat: 1n,
  polystrat: 10n ** 12n,
};

/**
 * Why a ROI-distribution blob should not be described as a complete, current reading —
 * or `null` when it can be.
 *
 * Returns the reason rather than a boolean so a caption can name the actual problem: a
 * snapshot that has not refreshed, one still backfilling and one whose mech costs are
 * implausibly low are three different warnings, and the last one means the returns are
 * *overstated* rather than merely late.
 *
 * These are the same conditions this module raises as `:stale`, `:backfilling` and
 * `:mech-attribution-low`, so the published caveat and the metric status cannot disagree.
 */
export type RoiSnapshotIssue = 'missing' | 'stale' | 'backfilling' | 'errors' | 'low-mech-cost';

export const roiSnapshotIssue = (
  snapshot: {
    // `unknown`, because callers hold a generic `MetricsSnapshot` off the blob store and
    // narrow it at the point of use, as the Predict page already does for the histograms.
    data?: unknown;
    timestamp?: number | null;
  } | null,
  platform: 'omenstrat' | 'polystrat'
): RoiSnapshotIssue | null => {
  const data = snapshot?.data as AgentBlueprintRoiData | null | undefined;
  if (!data) return 'missing';

  const timestamp = snapshot?.timestamp;
  if (typeof timestamp === 'number' && Date.now() - timestamp > ROI_SNAPSHOT_MAX_AGE_MS) {
    return 'stale';
  }
  if ((data.fetchErrors ?? []).length > 0) return 'errors';
  // A byDay cursor >=2 days behind means the windowed values are computed from incomplete
  // data. 1 day of tolerance covers the gap between UTC midnight and the daily cron run.
  if ((data.lastDayTimestamp ?? 0) < getMidnightUtcTimestampDaysAgo(1) - DAY_SECONDS) {
    return 'backfilling';
  }
  // Last, because it is the subtlest: everything above is current and error-free, and the
  // histogram still understates costs.
  if (hasLowMechAttribution(data, MECH_SCALE[platform])) return 'low-mech-cost';

  return null;
};

export type WindowedRoi = {
  // Prediction-only ROI per window (excludes staking rewards).
  partialRoi: MetricWithStatus<WindowedMetric<number | null>>;
  // Prediction + staking-rewards ROI per window (the headline value).
  finalRoi: MetricWithStatus<WindowedMetric<number | null>>;
};

// Combines the windowed prediction net gain / costs (from the roi-distribution
// snapshot's byDay/allTimeAgents data) with windowed staking rewards (from the
// staking-rewards accumulator) and the current OLAS price into windowed partial and
// final ROI. Staking rewards are valued at the current OLAS price — the same
// approximation the legacy all-time ROI used.
//
// Bucketing basis (intentional): ROI inherits roi-distribution's *settlement-day*
// bucketing, whereas the accuracy metric buckets by *placement day*. So the same "7D"
// tab covers slightly different bet populations across ROI vs Accuracy — each is the
// natural convention for its metric (ROI = P&L realised in the window; accuracy =
// predictions made in the window that have since resolved). See the /data methodology.
const computePlatformWindowedRoi = async (
  roiCategory: string,
  isPolystrat: boolean,
  priceChain: 'gnosis' | 'polygon',
  fetchRewards: () => Promise<StakingRewardsWindows>
): Promise<WindowedRoi> => {
  const source = isPolystrat ? 'polystrat' : 'omenstrat';

  let roiData: AgentBlueprintRoiData | null = null;
  let roiSnapshotTs: number | null = null;
  try {
    const snap = await getSnapshot({ category: roiCategory });
    roiData = (snap?.data as unknown as AgentBlueprintRoiData) ?? null;
    roiSnapshotTs = snap?.timestamp ?? null;
  } catch (e) {
    console.warn(`Could not load roi-distribution snapshot (${roiCategory})`, e);
  }

  // Missing blob → hard error; present-but-aging blob → stale error (propagates to UI).
  const roiSnapshotStale =
    roiSnapshotTs != null && Date.now() - roiSnapshotTs > ROI_SNAPSHOT_MAX_AGE_MS;
  const roiFetchErrors: string[] = [];
  const roiLagging: string[] = [];
  if (!roiData) {
    roiFetchErrors.push(`roi-distribution:${source}`);
  } else {
    if (roiSnapshotStale) roiFetchErrors.push(`roi-distribution:${source}:stale`);
    // Subgraph failures recorded by the daily refresh run that wrote the blob
    // (e.g. the all-time agents fetch failed and the previous totals were kept).
    for (const err of roiData.fetchErrors ?? []) {
      roiFetchErrors.push(`roi-distribution:${source}:${err}`);
    }
    // A byDay cursor ≥2 days behind means the windowed values are computed from
    // incomplete data, so flag it. 1 day of tolerance covers the gap between
    // UTC midnight and the daily cron run.
    if ((roiData.lastDayTimestamp ?? 0) < getMidnightUtcTimestampDaysAgo(1) - DAY_SECONDS) {
      roiFetchErrors.push(`roi-distribution:${source}:backfilling`);
    }
    // Missing mech cost overstates ROI — surface it on the lag channel (stale
    // indicator, value still publishes). A fetchError would make mergeWithFallback
    // freeze ROI on the held-over pre-recovery value for the whole recovery window.
    if (hasLowMechAttribution(roiData, MECH_SCALE[isPolystrat ? 'polystrat' : 'omenstrat'])) {
      roiLagging.push(`roi-distribution:${source}:mech-attribution-low`);
    }
  }

  // Advance the staking-rewards accumulator (it persists its own backfill progress).
  const rewards = await fetchRewards();
  const olasUsdPrice = await fetchOlasPriceInUsd(priceChain);

  const partial = emptyWindows();
  const final = emptyWindows();

  if (roiData) {
    for (const { key, days } of WINDOWS) {
      const { netGain, totalCosts } = computeWindowedNetGainAndCosts(roiData, days, isPolystrat);
      if (totalCosts <= 0n) continue;

      partial[key] = Number((netGain * 10000n) / totalCosts) / 100;

      // finalRoi needs both the staking-rewards window (covered, not backfilling) and
      // a price; otherwise it stays null and the UI shows `--` for that tab.
      const rewardsWei = rewards.value?.[key];
      if (rewardsWei != null && olasUsdPrice) {
        const rewardsUsdWei = (BigInt(rewardsWei) * olasUsdPrice) / SCALE_1E18;
        final[key] = Number(((netGain + rewardsUsdWei) * 10000n) / totalCosts) / 100;
      }
    }
  }

  const partialStatus = createStaleStatus({
    indexingErrors: [],
    fetchErrors: roiFetchErrors,
    laggingSubgraphs: roiLagging,
  });

  // finalRoi additionally depends on the rewards accumulator and the OLAS price.
  const finalStatus = createStaleStatus({
    indexingErrors: rewards.status?.indexingErrors ?? [],
    fetchErrors: [
      ...roiFetchErrors,
      ...(olasUsdPrice ? [] : ['balancer:olas-price']),
      ...(rewards.status?.fetchErrors ?? []),
    ],
    laggingSubgraphs: [...roiLagging, ...(rewards.status?.laggingSubgraphs ?? [])],
  });

  return {
    partialRoi: { value: partial, status: partialStatus },
    finalRoi: { value: final, status: finalStatus },
  };
};

export const fetchOmenstratWindowedRoi = (): Promise<WindowedRoi> =>
  computePlatformWindowedRoi(
    'roi-distribution/omenstrat-main',
    false,
    'gnosis',
    fetchOmenstratStakingRewards
  );

export const fetchPolystratWindowedRoi = (): Promise<WindowedRoi> =>
  computePlatformWindowedRoi(
    'roi-distribution/polystrat-main',
    true,
    'polygon',
    fetchPolystratStakingRewards
  );
