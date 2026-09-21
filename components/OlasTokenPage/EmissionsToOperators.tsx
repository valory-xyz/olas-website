import { Chart, Filler, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  EMISSIONS_CHART_COLORS,
  getCumulativeEmissions,
  getEmissionsChartOptions,
} from 'common-util/charts';
import { LegendItem } from 'components/ui/legend-item';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

type EmissionData = {
  counter?: number;
  [key: string]: unknown;
};

type EmissionsToOperatorsProps = {
  emissions: EmissionData[];
  loading: boolean;
};

/**
 * The four stages OLAS passes through on its way to a staker, in order. The gap between
 * each pair means something — see docs/staking-emissions-chart.md.
 */
const SERIES = [
  {
    field: 'totalMintedForStaking',
    label: 'OLAS minted for staking rewards',
    color: EMISSIONS_CHART_COLORS.stakingMinted,
  },
  {
    field: 'totalDispensedToStakingContracts',
    label: 'OLAS dispensed to staking contracts',
    color: EMISSIONS_CHART_COLORS.stakingDispensed,
  },
  {
    field: 'totalClaimableStakingRewards',
    label: 'Staking rewards claimable',
    color: EMISSIONS_CHART_COLORS.available,
  },
  {
    field: 'totalClaimedStakingRewards',
    label: 'Staking rewards claimed',
    color: EMISSIONS_CHART_COLORS.operators,
  },
] as const;

export const EmissionsToOperators = memo(({ emissions, loading }: EmissionsToOperatorsProps) => {
  // A snapshot written before these fields existed has no key for them, and a missing
  // key reads as 0 — a flat line at zero against a real ~12.3M. Absent and zero are
  // different claims, so a series is drawn only once its field is present.
  const present = SERIES.filter((series) => emissions.some((epoch) => series.field in epoch));
  const cumulative = present.map((series) => getCumulativeEmissions(emissions, series.field));

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Emissions per epoch
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        {present.map((series) => (
          <LegendItem key={series.field} color={series.color.legend} label={series.label} />
        ))}
      </div>
      <div className="flex flex-col flex-auto gap-8">
        <div className="flex-auto h-72">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={{
                labels: emissions.map((item) => item.counter ?? 0),
                datasets: present.map((series, index) => ({
                  label: series.label,
                  data: cumulative[index],
                  order: index + 1,
                  pointBackgroundColor: series.color.line,
                  borderColor: series.color.line,
                })),
              }}
              options={getEmissionsChartOptions(cumulative.flat())}
            />
          )}
        </div>
      </div>
    </div>
  );
});

EmissionsToOperators.displayName = 'EmissionsToOperators';
