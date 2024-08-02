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

export const EmissionsToBonders = ({ emissions, loading }) => {
  const bondsCreatedAmountOlasPoints = emissions.map(
    (item) => item.totalCreateBondsAmountOLAS || 0,
  );
  const productsCreatedSupplyPoints = emissions.map(
    (item) => item.totalCreateProductsSupply || 0,
  );
  const availableEmissionsPoints = emissions.map(
    (item) => item.effectiveBond || 0,
  );

  return (
    <div className="flex flex-col flex-auto p-4">
      <h2 className="text-sm text-slate-500 font-bold tracking-widest uppercase mb-6">
        Actual emissions per epoch
      </h2>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem
          color={EMISSIONS_CHART_COLORS.available.legend}
          label="OLAS available for bonding programmes via DAO vote"
        />
        <LegendItem
          color={EMISSIONS_CHART_COLORS.products.legend}
          label="OLAS allocated for bonding programmes via DAO vote"
        />
        <LegendItem
          color={EMISSIONS_CHART_COLORS.bonds.legend}
          label="OLAS emitted for bonds"
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
                    data: availableEmissionsPoints,
                    order: 1,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.available.line,
                    borderColor: EMISSIONS_CHART_COLORS.available.line,
                  },
                  {
                    label: 'Bonding programmes supply',
                    data: productsCreatedSupplyPoints,
                    order: 2,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.products.line,
                    borderColor: EMISSIONS_CHART_COLORS.products.line,
                  },
                  {
                    label: 'Bonds amount',
                    data: bondsCreatedAmountOlasPoints,
                    order: 3,
                    pointBackgroundColor: EMISSIONS_CHART_COLORS.bonds.line,
                    borderColor: EMISSIONS_CHART_COLORS.bonds.line,
                  },
                ],
              }}
              options={getEmissionsChartOptions([
                ...availableEmissionsPoints,
                ...productsCreatedSupplyPoints,
                ...bondsCreatedAmountOlasPoints,
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

EmissionsToBonders.propTypes = {
  emissions: PropTypes.arrayOf(emissionType).isRequired,
  loading: PropTypes.bool.isRequired,
};
