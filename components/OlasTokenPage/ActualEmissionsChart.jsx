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
  getEmissionsChartOptions,
} from 'common-util/charts';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';
import { LegendItem } from './LegendItem';
import { emissionType } from './types';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

export const ActualEmissionsChart = memo(({ emissions, loading }) => {
  const maxAvailableEmissions = emissions.map((_, index) => {
    return emissions
      .slice(0, index + 1)
      .reduce(
        (sum, item) =>
          sum +
          Number(item.availableDevIncentives || 0) +
          Number(item.availableStakingIncentives || 0) +
          Number(item.totalBondsClaimable || 0),
        0,
      );
  });

  const actualEmissions = emissions.map((_, index) => {
    return emissions
      .slice(0, index + 1)
      .reduce(
        (sum, item) =>
          sum +
          Number(item.devIncentivesTotalTopUp || 0) +
          Number(item.totalStakingIncentives || 0) +
          Number(item.totalBondsClaimed || 0),
        0,
      );
  });

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem
          color={EMISSIONS_CHART_COLORS.available.legend}
          label="Max available emissions"
        />
        <LegendItem
          color={EMISSIONS_CHART_COLORS.actual.legend}
          label="Actual emissions"
        />
      </div>
      <div className="flex flex-col flex-auto gap-8">
        <div className="flex-auto h-[500px]">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={{
                labels: emissions.map((item) => item.counter),
                datasets: [
                  {
                    label: 'Available emissions',
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
              options={getEmissionsChartOptions([
                ...maxAvailableEmissions,
                ...actualEmissions,
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
});

ActualEmissionsChart.displayName = 'ActualEmissionsChart';

ActualEmissionsChart.propTypes = {
  emissions: PropTypes.arrayOf(emissionType).isRequired,
  loading: PropTypes.bool.isRequired,
};
