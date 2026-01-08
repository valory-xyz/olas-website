import {
  Chart,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import {
  EMISSIONS_CHART_COLORS,
  getCumulativeEmissions,
  getEmissionsChartOptions,
} from 'common-util/charts';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';
import { LegendItem } from './LegendItem';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

interface EmissionData {
  counter?: number;
  [key: string]: unknown;
}

interface EmissionsToOperatorsProps {
  emissions: EmissionData[];
  loading: boolean;
}

export const EmissionsToOperators = memo(
  ({ emissions, loading }: EmissionsToOperatorsProps) => {
    const totalClaimableStakingRewards = getCumulativeEmissions(
      emissions,
      'totalClaimableStakingRewards',
    );
    const totalClaimedStakingRewards = getCumulativeEmissions(
      emissions,
      'totalClaimedStakingRewards',
    );

    return (
      <div className="flex flex-col flex-auto p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
          Emissions per epoch
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
          <LegendItem
            color={EMISSIONS_CHART_COLORS.available.legend}
            label="Staking rewards claimable"
          />
          <LegendItem
            color={EMISSIONS_CHART_COLORS.operators.legend}
            label="Staking rewards claimed"
          />
        </div>
        <div className="flex flex-col flex-auto gap-8">
          <div className="flex-auto h-72">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <Line
                data={{
                  labels: emissions.map((item) => item.counter ?? 0),
                  datasets: [
                    {
                      label: 'Staking rewards claimable',
                      data: totalClaimableStakingRewards,
                      order: 1,
                      pointBackgroundColor:
                        EMISSIONS_CHART_COLORS.available.line,
                      borderColor: EMISSIONS_CHART_COLORS.available.line,
                    },
                    {
                      label: 'Staking rewards claimed',
                      data: totalClaimedStakingRewards,
                      order: 2,
                      pointBackgroundColor:
                        EMISSIONS_CHART_COLORS.operators.line,
                      borderColor: EMISSIONS_CHART_COLORS.operators.line,
                    },
                  ],
                }}
                options={getEmissionsChartOptions([
                  ...totalClaimableStakingRewards,
                  ...totalClaimableStakingRewards,
                  10 ** 18, // Add this temporarily while we don't have data on staking
                ])}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

EmissionsToOperators.displayName = 'EmissionsToOperators';
