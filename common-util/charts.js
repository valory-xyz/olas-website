import { formatWeiNumber } from "common-util/numberFormatter";

export const EMISSIONS_CHART_COLORS = {
  available: {
    legend: "bg-slate-400",
    line: "#7D8A9E",
  },
  devRewards: {
    legend: "bg-cyan-500",
    line: "#09B4D7",
  },
  products: {
    legend: "bg-fuchsia-400",
    line: "#E879F9",
  },
  bonds: {
    legend: "bg-purple-500",
    line: "#A855F7",
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
        text: "Epoch",
      },
      gridLines: {
        color: "white",
      },
    },
    y: {
      title: {
        display: true,
        text: "OLAS Emitted",
      },
      max:
        Math.max(...points) *
        MAX_MARGIN,
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
    mode: "nearest",
    axis: "x",
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
