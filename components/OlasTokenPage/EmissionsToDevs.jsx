import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from 'chart.js';

import {
  getEmissionsChartOptions,
  EMISSIONS_CHART_COLORS,
} from 'common-util/charts';
import { LegendItem } from './LegendItem';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

export const EmissionsToDevs = ({ emissions, loading }) => {
  const devIncentivesPoints = emissions.map(
    (item) => item.devIncentivesTotalTopUp || 0,
  );
  const availableDevIncentivesPoints = emissions.map(
    (item) => item.availableDevIncentives || 0,
  );

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="flex gap-4 mb-6">
        <LegendItem
          color={EMISSIONS_CHART_COLORS.available.legend}
          label="Available dev emissions"
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
};

EmissionsToDevs.propTypes = {
  emissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      counter: PropTypes.number,
      availableDevIncentives: PropTypes.string,
      devIncentivesTotalTopUp: PropTypes.string,
      effectiveBond: PropTypes.string,
      totalCreateProductsSupply: PropTypes.string,
      totalCreateBondsAmountOLAS: PropTypes.string,
    }),
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};
