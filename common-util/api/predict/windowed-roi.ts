import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';
import { getSnapshot } from 'common-util/snapshot-storage';
import { emptyWindows, WindowedMetric, WindowKey } from './omenstrat-brier';
import { fetchOlasPriceInUsd } from './olas-price';
import { AgentBlueprintRoiData, computeWindowedNetGainAndCosts } from './roi-distribution';
import {
  fetchOmenstratStakingRewards,
  fetchPolystratStakingRewards,
  StakingRewardsWindows,
} from './staking-rewards';

const SCALE_1E18 = 10n ** 18n;

const WINDOWS: { key: WindowKey; days: number | null }[] = [
  { key: '7d', days: 7 },
  { key: '30d', days: 30 },
  { key: '90d', days: 90 },
  { key: 'max', days: null },
];

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
const computePlatformWindowedRoi = async (
  roiCategory: string,
  isPolystrat: boolean,
  priceChain: 'gnosis' | 'polygon',
  fetchRewards: () => Promise<StakingRewardsWindows>
): Promise<WindowedRoi> => {
  const source = isPolystrat ? 'polystrat' : 'omenstrat';

  let roiData: AgentBlueprintRoiData | null = null;
  try {
    const snap = await getSnapshot({ category: roiCategory });
    roiData = (snap?.data as unknown as AgentBlueprintRoiData) ?? null;
  } catch (e) {
    console.warn(`Could not load roi-distribution snapshot (${roiCategory})`, e);
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
    fetchErrors: roiData ? [] : [`roi-distribution:${source}`],
  });

  // finalRoi additionally depends on the rewards accumulator and the OLAS price.
  const finalStatus = createStaleStatus({
    indexingErrors: rewards.status?.indexingErrors ?? [],
    fetchErrors: [
      ...(roiData ? [] : [`roi-distribution:${source}`]),
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
