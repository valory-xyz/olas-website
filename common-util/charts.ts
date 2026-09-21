import { formatWeiNumber } from 'common-util/numberFormatter';

export const EMISSIONS_CHART_COLORS = {
  available: {
    legend: 'bg-slate-400',
    line: '#7D8A9E',
  },
  devRewards: {
    legend: 'bg-cyan-500',
    line: '#09B4D7',
  },
  products: {
    legend: 'bg-fuchsia-400',
    line: '#E879F9',
  },
  bonds: {
    legend: 'bg-purple-500',
    line: '#A855F7',
  },
  operators: {
    legend: 'bg-amber-400',
    line: '#FFB347',
  },
  // The staking stages without an existing colour; claimable and claimed reuse
  // `available` and `operators`. Validated as a set — see docs/staking-emissions-chart.md.
  stakingMinted: {
    legend: 'bg-slate-600',
    line: '#475569',
  },
  stakingDispensed: {
    legend: 'bg-orange-600',
    line: '#EA580C',
  },
  actual: {
    legend: 'bg-green-400',
    line: '#3FE681',
  },
};

const MAX_MARGIN = 1.2;

export const getEmissionsChartOptions = (points) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Epoch',
      },
      grid: {
        color: 'white',
      },
    },
    y: {
      title: {
        display: true,
        text: 'OLAS Emitted',
      },
      max: Math.max(...points) * MAX_MARGIN,
      ticks: {
        callback(value) {
          return formatWeiNumber(value);
        },
      },
    },
  },
  interaction: {
    intersect: false,
    includeInvisible: true,
    mode: 'nearest' as const,
    axis: 'x' as const,
  },
  plugins: {
    // Each of these charts renders its own LegendItem row. Chart.js only draws its
    // built-in legend when the Legend plugin happens to be registered, which another
    // chart elsewhere in the app does globally — so it has to be turned off explicitly
    // or it appears on whichever pages loaded that bundle first.
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        title: (tooltipItems) => `Epoch ${tooltipItems[0].label}`,
        label: (tooltipItem) => `${tooltipItem.dataset.label}: ${formatWeiNumber(tooltipItem.raw)}`,
      },
    },
  },
});

/**
 * Calculates cumulative sum of emission values for specified fields
 * @param {Array<Object>} emissions - Array of emission data objects
 * @param {string|string[]} fieldNames - Single field name or array of field names to sum
 * @returns {Array<number>} Array of emissions with cumulative sums for the specified fields
 */
export const getCumulativeEmissions = (emissions, fieldNames) => {
  const fieldsToSum = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
  const cumulativeEmissions = [];

  let cumulativeSum = 0;

  for (const emission of emissions) {
    const currentEmissionSum = fieldsToSum.reduce(
      (sum, field) => sum + Number(emission[field] || 0),
      0
    );
    cumulativeSum += currentEmissionSum;
    cumulativeEmissions.push(cumulativeSum);
  }

  return cumulativeEmissions;
};
