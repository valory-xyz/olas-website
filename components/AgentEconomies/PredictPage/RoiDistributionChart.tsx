'use client';

import { BarElement, Chart as ChartJS, ChartOptions, Legend, LinearScale, Tooltip } from 'chart.js';
import { BinData } from 'common-util/api/predict/roi-distribution';
import { Tabs } from 'components/ui/tabs';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(LinearScale, BarElement, Tooltip, Legend);

type TimeRange = '7D' | '30D' | '90D' | 'Max';

type RoiDistributionData = {
  d7: BinData[] | null;
  d30: BinData[] | null;
  d90: BinData[] | null;
  all: BinData[] | null;
};

type DataPoint = {
  x: number;
  y: number;
  range: string;
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

const X_AXIS_STEP_SIZE = 50;

const ROI_DISTRIBUTION_CHART_OPTIONS: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  parsing: false, // important when using {x,y}
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index', // 🔹 show all datasets at the same x-value
      intersect: false, // 🔹 allows hover anywhere near the x-position
      callbacks: {
        title: (items) => (items[0]?.raw as DataPoint)?.range ?? '',
        label: (item) => ` ${item.dataset.label}: ${(item.raw as DataPoint).y}% of agents`,
      },
    },
  },
  scales: {
    x: {
      type: 'linear' as const,
      min: -100,
      max: 200,
      grid: { display: false },
      ticks: {
        stepSize: X_AXIS_STEP_SIZE,
        callback: (value: number) => `${value}%`,
      },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.06)' },
      ticks: {
        font: { size: 14 },
        callback: (value: number) => `${value}%`,
      },
    },
  },
};

type RoiDistributionChartProps = {
  data: RoiDistributionData | null;
  className?: string;
  id?: string;
};

const safeMidpoint = (min: number, max: number) => {
  if (!isFinite(min)) return -100;
  if (!isFinite(max)) return 200;
  return (min + max) / 2;
};

export const RoiDistributionChart = ({ data, className, id }: RoiDistributionChartProps) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('7D');

  const activeKey = TIME_RANGES.find((range) => range.label === activeRange)?.key ?? 'd7';
  const bins = data?.[activeKey] ?? null;

  const chartData = bins
    ? {
        datasets: [
          // {
          //   label: 'Omenstrat',
          //   data: bins.map((bin) => ({
          //     x: safeMidpoint(bin.min, bin.max),
          //     y: bin.omenstrat,
          //     range: bin.label,
          //   })),
          //   backgroundColor: OMENSTRAT_COLOR,
          //   borderColor: OMENSTRAT_COLOR_BORDER,
          //   borderWidth: 1,
          //   borderRadius: 2,
          //   barPercentage: 0.9,
          //   categoryPercentage: 0.85,
          // },
          {
            label: 'Polystrat',
            data: bins.map((bin) => ({
              x: safeMidpoint(bin.min, bin.max),
              y: bin.polystrat,
              range: bin.label,
            })),
            backgroundColor: POLYSTRAT_COLOR,
            borderColor: POLYSTRAT_COLOR_BORDER,
            borderWidth: 1,
            borderRadius: 2,
            barPercentage: 0.9,
            categoryPercentage: 0.85,
          },
        ],
      }
    : null;

  return (
    <div
      id={id}
      className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] p-6 ${className}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Polystrat Partial ROI Distribution</h3>

        <Tabs
          items={TIME_RANGES.map(({ label }) => ({ key: label, label }))}
          activeKey={activeRange}
          onChange={(key) => setActiveRange(key as TimeRange)}
        />
      </div>

      {/* Legend row */}
      {/* <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        <LegendItem color={`bg-[#A755F7]`} label="Omenstrat" />
        <LegendItem color={`bg-[#4D74FF]`} label="Polystrat" />
      </div> */}

      {/* Chart area */}
      {chartData ? (
        <div className="relative w-full aspect-[2/1]">
          <Bar key={activeRange} data={chartData} options={ROI_DISTRIBUTION_CHART_OPTIONS} />
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-[2/1] text-gray-400 text-sm">
          {data === null ? 'Data not yet available' : 'No data for this time range'}
        </div>
      )}
    </div>
  );
};
