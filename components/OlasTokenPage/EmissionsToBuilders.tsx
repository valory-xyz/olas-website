import {
  Chart,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';

import {
  EMISSIONS_CHART_COLORS,
  getCumulativeEmissions,
  getEmissionsChartOptions,
} from 'common-util/charts';
import { LegendItem } from './LegendItem';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

interface EmissionData {
  counter?: number;
  [key: string]: unknown;
}

interface EmissionsToBuildersProps {
  emissions: EmissionData[];
  loading: boolean;
}

export const EmissionsToBuilders = memo(
  ({ emissions, loading }: EmissionsToBuildersProps) => {
    const devIncentivesPoints = getCumulativeEmissions(
      emissions,
      'devIncentivesTotalTopUp',
    );
    const availableDevIncentivesPoints = getCumulativeEmissions(
      emissions,
      'availableDevIncentives',
    );

    return (
      <div className="flex flex-col flex-auto p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
          Emissions per epoch
        </h2>
        <div className="flex gap-4 mb-6">
          <LegendItem
            color={EMISSIONS_CHART_COLORS.available.legend}
            label="Dev rewards available for claiming"
          />
          <LegendItem
            color={EMISSIONS_CHART_COLORS.devRewards.legend}
            label="Dev rewards claimed"
          />
        </div>
        <div className="flex flex-col flex-auto gap-8">
          <div className="flex-auto">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <Line
                data={{
                  labels: emissions.map((item) => item.counter ?? 0),
                  datasets: [
                    {
                      label: 'Available incentives',
                      data: availableDevIncentivesPoints,
                      pointBackgroundColor:
                        EMISSIONS_CHART_COLORS.available.line,
                      borderColor: EMISSIONS_CHART_COLORS.available.line,
                    },
                    {
                      label: 'Emitted incentives',
                      data: devIncentivesPoints,
                      pointBackgroundColor:
                        EMISSIONS_CHART_COLORS.devRewards.line,
                      borderColor: EMISSIONS_CHART_COLORS.devRewards.line,
                    },
                  ],
                }}
                options={getEmissionsChartOptions([
                  ...devIncentivesPoints,
                  ...availableDevIncentivesPoints,
                ])}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

EmissionsToBuilders.displayName = 'EmissionsToBuilders';
