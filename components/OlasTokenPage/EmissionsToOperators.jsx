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
import { emissionType } from './types';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

export const EmissionsToOperators = ({ emissions, loading }) => {
  const availableStakingIncentivesPoints = emissions.map(
    (item) => item.availableStakingIncentives || 0,
  );
  const totalStakingIncentivesPoints = emissions.map(
    (item) => item.totalStakingIncentives || 0,
  );

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem
          color={EMISSIONS_CHART_COLORS.available.legend}
          label="Available staking emissions"
        />
        <LegendItem
          color={EMISSIONS_CHART_COLORS.operators.legend}
          label="OLAS emitted to staking contracts"
        />
      </div>
      <div className="flex flex-col flex-auto gap-8">
        <div className="flex-auto h-72">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Line
              data={{
                labels: emissions.map((item) => item.counter),
                datasets: [
                  {
                    label: 'Available emissions',
                    data: availableStakingIncentivesPoints,
                    order: 1,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.available.line,
                    borderColor: EMISSIONS_CHART_COLORS.available.line,
                  },
                  {
                    label: 'Staking incentives',
                    data: totalStakingIncentivesPoints,
                    order: 2,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.operators.line,
                    borderColor: EMISSIONS_CHART_COLORS.operators.line,
                  },
                ],
              }}
              options={getEmissionsChartOptions([
                ...availableStakingIncentivesPoints,
                ...availableStakingIncentivesPoints,
                10 ** 18, // Add this temporarily while we don't have data on staking
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

EmissionsToOperators.propTypes = {
  emissions: PropTypes.arrayOf(emissionType).isRequired,
  loading: PropTypes.bool.isRequired,
};
