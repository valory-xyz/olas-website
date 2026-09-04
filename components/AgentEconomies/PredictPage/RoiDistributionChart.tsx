'use client';

import { BarElement, Chart as ChartJS, ChartOptions, Legend, LinearScale, Tooltip } from 'chart.js';
import { BinData, RangeKey, RoiDistribution } from 'common-util/api/predict/roi-distribution';
import { Tabs } from 'components/ui/tabs';
import { formatUtcAsOf } from 'common-util/time';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(LinearScale, BarElement, Tooltip, Legend);

type TimeRange = '7d' | '30d' | '90d' | 'max';

type DataPoint = {
  x: number;
  y: number;
  range: string;
};

const TIME_RANGES: Array<{
  key: TimeRange;
  label: string;
  dataKey: RangeKey;
}> = [
  { key: '7d', label: '7D', dataKey: 'd7' },
  { key: '30d', label: '30D', dataKey: 'd30' },
  { key: '90d', label: '90D', dataKey: 'd90' },
  { key: 'max', label: 'Max', dataKey: 'all' },
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
      title: {
        display: true,
        text: 'ROI Distribution',
        font: { size: 13 },
      },
      ticks: {
        stepSize: X_AXIS_STEP_SIZE,
        callback: (value: number) => `${value}%`,
      },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.06)' },
      title: {
        display: true,
        text: '% of Agents',
        font: { size: 13 },
      },
      ticks: {
        font: { size: 14 },
        callback: (value: number) => `${value}%`,
      },
    },
  },
};

type RoiDistributionChartProps = {
  data: RoiDistribution | null;
  platform: 'polystrat' | 'omenstrat';
  className?: string;
  id?: string;
  /** As-of for the daily ROI snapshot behind this platform's histogram. */
  snapshotTimestamp?: number | null;
  /** True when that snapshot is stale or still backfilling. */
  isIncomplete?: boolean;
};

const safeMidpoint = (min: number, max: number) => {
  if (!isFinite(min)) return -100;
  if (!isFinite(max)) return 200;
  return (min + max) / 2;
};

export const RoiDistributionChart = ({
  data,
  platform,
  className,
  id,
  snapshotTimestamp = null,
  isIncomplete = false,
}: RoiDistributionChartProps) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('7d');

  const activeDataKey = TIME_RANGES.find((range) => range.key === activeRange)?.dataKey ?? 'd7';
  const activeRangeLabel =
    activeRange === 'max' ? 'over all time' : `over the last ${activeRange.replace('d', '')} days`;
  const bins = data?.bins?.[activeDataKey] ?? null;

  // An all-zero histogram is also what a missing blob produces, so the count decides
  // whether there is a distribution to describe at all.
  const agentCount = data?.netPositive?.[activeDataKey]?.[platform]?.agents ?? 0;
  const asOf = formatUtcAsOf(snapshotTimestamp);

  const isOmen = platform === 'omenstrat';
  const datasetMeta = isOmen
    ? {
        label: 'Omenstrat',
        background: OMENSTRAT_COLOR,
        border: OMENSTRAT_COLOR_BORDER,
        pick: (bin: BinData) => bin.omenstrat,
      }
    : {
        label: 'Polystrat',
        background: POLYSTRAT_COLOR,
        border: POLYSTRAT_COLOR_BORDER,
        pick: (bin: BinData) => bin.polystrat,
      };

  const chartData = bins
    ? {
        datasets: [
          {
            label: datasetMeta.label,
            data: bins.map((bin) => ({
              x: safeMidpoint(bin.min, bin.max),
              y: datasetMeta.pick(bin),
              range: bin.label,
            })),
            backgroundColor: datasetMeta.background,
            borderColor: datasetMeta.border,
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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {datasetMeta.label} Trading ROI Distribution
          </h3>
        </div>

        <Tabs
          ariaLabel="ROI distribution time range"
          items={TIME_RANGES.map(({ key, label }) => ({ key, label }))}
          activeKey={activeRange}
          onChange={(key) => setActiveRange(key as TimeRange)}
        />
      </div>

      {/* Screen-reader-only mirror. The chart is a <canvas>, so it holds no text at any
          point, and both the range and the platform live in React state — nothing in the
          served HTML says which distribution is on screen. A summary, not a transcription:
          the bin labels and their shares are what a reader would quote. */}
      {bins && bins.length > 0 && agentCount > 0 && (
        <section aria-label={`${datasetMeta.label} trading ROI distribution`} className="sr-only">
          <table>
            <caption>
              {`Trading ROI distribution for the ${agentCount} ${datasetMeta.label} agents that qualify, ${activeRangeLabel}. ` +
                `Trading ROI reflects prediction performance only, excluding staking rewards, and each range sums profit and loss realised on markets that settled within it. ` +
                `Qualifying agents are those with positive trading costs${activeRange === 'max' ? ' and at least 10 lifetime bets' : ''}; percentages are shares of that population, not of all ${datasetMeta.label} agents.` +
                (asOf ? ` As of ${asOf}.` : '') +
                (isIncomplete
                  ? ' The underlying daily snapshot is stale or still backfilling, so this distribution may be incomplete.'
                  : '')}
            </caption>
            <tbody>
              {bins.map((bin) => (
                <tr key={bin.label}>
                  <th scope="row">{`Trading ROI ${bin.label}`}</th>
                  <td>{`${datasetMeta.pick(bin).toFixed(1)}% of qualifying ${datasetMeta.label} agents`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

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
