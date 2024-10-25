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
  getEmissionsChartOptionsFromNumber,
} from 'common-util/charts';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import Web3 from 'web3';
import { LegendItem } from './LegendItem';
import { emissionType } from './types';

Chart.register(LineElement, LinearScale, PointElement, Filler, Tooltip);

export const ActualEmissionsChart = ({ emissions, loading }) => {
  const maxAvailableEmissions = emissions.map((item) => {
    const total =
      BigInt(item.availableDevIncentives ?? 0) +
      BigInt(item.availableStakingIncentives ?? 0) +
      BigInt(item.effectiveBond ?? 0);

    return Web3.utils.fromWei(total, 'ether');
  });

  const actualEmissions = emissions.map((item) => {
    const total =
      BigInt(item.devIncentivesTotalTopUp ?? 0) +
      BigInt(item.totalStakingIncentives ?? 0) +
      BigInt(item.totalCreateBondsAmountOLAS ?? 0);

    return Web3.utils.fromWei(total, 'ether');
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
              options={getEmissionsChartOptionsFromNumber(
                ...maxAvailableEmissions,
                ...actualEmissions,
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ActualEmissionsChart.propTypes = {
  emissions: PropTypes.arrayOf(emissionType).isRequired,
  loading: PropTypes.bool.isRequired,
};
