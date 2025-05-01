import {
  Chart,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { Line } from 'react-chartjs-2';

import {
  EMISSIONS_CHART_COLORS,
  getEmissionsChartOptions,
} from 'common-util/charts';
import { LegendItem } from './LegendItem';
import { emissionType } from './types';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

export const EmissionsToBuilders = memo(({ emissions, loading }) => {
  const devIncentivesPoints = emissions.map((_, index) => {
    return emissions
      .slice(0, index + 1)
      .reduce(
        (sum, item) => sum + Number(item.devIncentivesTotalTopUp || 0),
        0,
      );
  });

  const availableDevIncentivesPoints = emissions.map((_, index) => {
    return emissions
      .slice(0, index + 1)
      .reduce((sum, item) => sum + Number(item.availableDevIncentives || 0), 0);
  });

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
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
                labels: emissions.map((item) => item.counter),
                datasets: [
                  {
                    label: 'Available incentives',
                    data: availableDevIncentivesPoints,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.available.line,
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
});

EmissionsToBuilders.displayName = 'EmissionsToBuilders';

EmissionsToBuilders.propTypes = {
  emissions: PropTypes.arrayOf(emissionType).isRequired,
  loading: PropTypes.bool.isRequired,
};
