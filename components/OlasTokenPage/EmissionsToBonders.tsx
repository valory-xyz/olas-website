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

interface EmissionsToBondersProps {
  emissions: EmissionData[];
  loading: boolean;
}

export const EmissionsToBonders = memo(
  ({ emissions, loading }: EmissionsToBondersProps) => {
    const totalBondsClaimable = getCumulativeEmissions(
      emissions,
      'totalBondsClaimable',
    );
    const totalBondsClaimed = getCumulativeEmissions(
      emissions,
      'totalBondsClaimed',
    );

    return (
      <div className="flex flex-col flex-auto p-4">
        <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
          Emissions per epoch
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
          <LegendItem
            color={EMISSIONS_CHART_COLORS.available.legend}
            label="OLAS bonds claimable"
          />
          <LegendItem
            color={EMISSIONS_CHART_COLORS.bonds.legend}
            label="OLAS bonds claimed"
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
                      label: 'OLAS bonds claimable',
                      data: totalBondsClaimable,
                      order: 1,
                      pointBackgroundColor:
                        EMISSIONS_CHART_COLORS.available.line,
                      borderColor: EMISSIONS_CHART_COLORS.available.line,
                    },
                    {
                      label: 'OLAS bonds claimed',
                      data: totalBondsClaimed,
                      order: 2,
                      pointBackgroundColor: EMISSIONS_CHART_COLORS.bonds.line,
                      borderColor: EMISSIONS_CHART_COLORS.bonds.line,
                    },
                  ],
                }}
                options={getEmissionsChartOptions([
                  ...totalBondsClaimable,
                  ...totalBondsClaimed,
                ])}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

EmissionsToBonders.displayName = 'EmissionsToBonders';
