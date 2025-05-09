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
      gridLines: {
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
    mode: 'nearest',
    axis: 'x',
  },
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        title: (tooltipItems) => `Epoch ${tooltipItems[0].label}`,
        label: (tooltipItem) =>
          `${tooltipItem.dataset.label}: ${formatWeiNumber(tooltipItem.raw)}`,
      },
    },
  },
});

/**
 * Calculates cumulative sum of a single field or multiple fields from emissions data
 * @param {Array} emissions - Array of emission data objects
 * @param {string|string[]} fields - Single field name or array of field names to sum
 * @returns {Array} Array of cumulative sums
 */
export const getCumulativeData = (emissions, fields) => {
  const fieldArray = Array.isArray(fields) ? fields : [fields];

  return emissions.map((_, index) => {
    return emissions.slice(0, index + 1).reduce((sum, item) => {
      const fieldSum = fieldArray.reduce(
        (fieldTotal, field) => fieldTotal + Number(item[field] || 0),
        0,
      );
      return sum + fieldSum;
    }, 0);
  });
};
