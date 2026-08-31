import { DEFAULT_MECH_FEE } from 'common-util/constants';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';
import { getSnapshot } from 'common-util/snapshot-storage';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';
import { emptyWindows, WindowedMetric, WindowKey } from './omenstrat-brier';
import { fetchOlasPriceInUsd } from './olas-price';
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

// Booked mech fees below this share of settled costs mean QMR attribution is
// broken. Healthy weeks run 200–600bps; the 2026-08 Polystrat incident ran
// ~16bps (derivation: docs/predict-roi-accounting.md, Observability).
const MIN_MECH_FEE_BPS = 50n;

// True when the last 7 full days settled trading volume with implausibly low
// booked mech cost. Predict agents always pay mech fees before betting, and a
// broken QMR feed books a trickle, not a clean zero — so this is a ratio
// check, not a zero check. `scale` lifts tradedSettled to 18 decimals
// (polystrat entries are USDC 1e6).
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
  const mechFees = BigInt(mechRequests) * DEFAULT_MECH_FEE;
  return settledCosts > 0n && mechFees * 10000n < settledCosts * MIN_MECH_FEE_BPS;
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
    // Missing mech cost overstates ROI — surface it as staleness.
    if (hasLowMechAttribution(roiData, isPolystrat ? 10n ** 12n : 1n)) {
      roiFetchErrors.push(`roi-distribution:${source}:mech-attribution-low`);
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
  });

  // finalRoi additionally depends on the rewards accumulator and the OLAS price.
  const finalStatus = createStaleStatus({
    indexingErrors: rewards.status?.indexingErrors ?? [],
    fetchErrors: [
      ...roiFetchErrors,
      ...(olasUsdPrice ? [] : ['balancer:olas-price']),
      ...(rewards.status?.fetchErrors ?? []),
    ],
    laggingSubgraphs: rewards.status?.laggingSubgraphs ?? [],
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
