'use client';

import { BinData } from 'common-util/api/predict/roi-distribution';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { LegendItem } from 'components/ui/legend-item';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type TimeRange = '7D' | '30D' | '90D' | 'Max';

type RoiDistributionData = {
  d7: BinData[] | null;
  d30: BinData[] | null;
  d90: BinData[] | null;
  all: BinData[] | null;
};

const TIME_RANGES: Array<{ label: TimeRange; key: keyof RoiDistributionData }> = [
  { label: '7D', key: 'd7' },
  { label: '30D', key: 'd30' },
  { label: '90D', key: 'd90' },
  { label: 'Max', key: 'all' },
];

const OMENSTRAT_COLOR = '#A755F7';
const POLYSTRAT_COLOR = '#4D74FF';
const OMENSTRAT_COLOR_BORDER = 'rgba(126, 34, 206, 1)';
const POLYSTRAT_COLOR_BORDER = 'rgba(46, 92, 255, 1)';

const ROI_DISTRIBUTION_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'start' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'rect',
        padding: 16,
        font: { size: 13 },
      },
    },
    tooltip: {
      callbacks: {
        title: (items) => `ROI: ${items[0]?.label ?? ''}`,
        label: (item) => {
          const name = item.dataset.label;
          const val = item.parsed.y;
          return ` ${name}: ${val}% of agents`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 14 },
        callback: function (value) {
          const label = this.getLabelForValue(value);

          // Map the specific range labels to clean integer markers
          const milestones: Record<string, string> = {
            '< -100%': '-100%',
            '-50% to -40%': '-50%',
            '-10% to 0%': '0%', // Shows '0' at the end of the losing side
            '40% to 50%': '+50%',
            '90% to 100%': '+100%',
            '> 200%': '+200%',
          };

          return milestones[label] || null;
        },
        autoSkip: false, // Prevents Chart.js from randomly skipping others
        maxRotation: 0, // Keeps it horizontal for a cleaner look
      },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.06)' },
      ticks: {
        font: { size: 14 },
        callback: (value) => `${value}%`,
      },
    },
  },
};

type RoiDistributionChartProps = {
  data: RoiDistributionData | null;
  className?: string;
};

export const RoiDistributionChart = ({ data, className }: RoiDistributionChartProps) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('7D');

  const activeKey = TIME_RANGES.find((range) => range.label === activeRange)?.key ?? 'd7';
  const bins = data?.[activeKey] ?? null;

  const chartData = bins
    ? {
        labels: bins.map((bin) => bin.label),
        datasets: [
          {
            label: 'Omenstrat',
            data: bins.map((bin) => bin.omenstrat),
            backgroundColor: OMENSTRAT_COLOR,
            borderColor: OMENSTRAT_COLOR_BORDER,
            borderWidth: 1,
            borderRadius: 3,
          },
          {
            label: 'Polystrat',
            data: bins.map((bin) => bin.polystrat),
            backgroundColor: POLYSTRAT_COLOR,
            borderColor: POLYSTRAT_COLOR_BORDER,
            borderWidth: 1,
            borderRadius: 3,
          },
        ],
      }
    : null;

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] p-6 ${className}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Partial ROI Distribution</h3>

        {/* Time range tabs */}
        <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-lg p-1">
          {TIME_RANGES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveRange(label)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeRange === label
                  ? 'bg-slate-100 text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legent row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem color={`bg-[#A755F7]`} label="Omenstrat" />
        <LegendItem color={`bg-[#4D74FF]`} label="Polystrat" />
      </div>

      {/* Chart area */}
      {chartData ? (
        <div style={{ height: '340px' }}>
          <Bar key={activeRange} data={chartData} options={ROI_DISTRIBUTION_CHART_OPTIONS} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[340px] text-gray-400 text-sm">
          {data === null ? 'Data not yet available' : 'No data for this time range'}
        </div>
      )}
    </div>
  );
};
