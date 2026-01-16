import { Chart, Filler, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import {
  EMISSIONS_CHART_COLORS,
  getCumulativeEmissions,
  getEmissionsChartOptions,
} from 'common-util/charts';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';
import { LegendItem } from './LegendItem';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

type EmissionData = {
  counter?: number;
  [key: string]: unknown;
};

type ActualEmissionsChartProps = {
  emissions: EmissionData[];
  loading: boolean;
};

export const ActualEmissionsChart = memo(({ emissions, loading }: ActualEmissionsChartProps) => {
  const maxAvailableEmissions = getCumulativeEmissions(emissions, [
    'availableDevIncentives',
    'totalClaimableStakingRewards',
    'totalBondsClaimable',
  ]);

  const actualEmissions = getCumulativeEmissions(emissions, [
    'devIncentivesTotalTopUp',
    'totalClaimedStakingRewards',
    'totalBondsClaimed',
  ]);

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Emissions per epoch
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem
          color={EMISSIONS_CHART_COLORS.available.legend}
          label="Claimable emissions (including dev incentives, bonds, and staking)"
        />
        <LegendItem
          color={EMISSIONS_CHART_COLORS.actual.legend}
          label="Claimed emissions (including dev incentives, bonds, and staking)"
        />
      </div>
      <div className="flex flex-col flex-auto gap-8">
        <div className="flex-auto h-[500px]">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={{
                labels: emissions.map((item) => item.counter ?? 0),
                datasets: [
                  {
                    label: 'Claimable emissions',
                    data: maxAvailableEmissions,
                    order: 1,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.available.line,
                    borderColor: EMISSIONS_CHART_COLORS.available.line,
                  },
                  {
                    label: 'Actual emissions',
                    data: actualEmissions,
                    order: 2,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.actual.line,
                    borderColor: EMISSIONS_CHART_COLORS.actual.line,
                  },
                ],
              }}
              options={getEmissionsChartOptions([...maxAvailableEmissions, ...actualEmissions])}
            />
          )}
        </div>
      </div>
    </div>
  );
});

ActualEmissionsChart.displayName = 'ActualEmissionsChart';
