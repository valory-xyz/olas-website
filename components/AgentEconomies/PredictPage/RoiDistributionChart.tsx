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
  /**
   * Freshness per platform, not just the one on screen: the two ROI accumulators are
   * separate daily jobs, so the mirror below must date each platform's tables with its
   * own snapshot rather than borrowing the active one's.
   */
  snapshots?: Partial<Record<'polystrat' | 'omenstrat', RoiSnapshot>>;
};

/** As-of for one platform's daily ROI blob, and whether it is stale or still backfilling. */
type RoiSnapshot = { timestamp?: number | null; isIncomplete?: boolean };

const rangeLabelFor = (range: TimeRange) =>
  range === 'max' ? 'over all time' : `over the last ${range.replace('d', '')} days`;

type DatasetMeta = {
  label: string;
  background: string;
  border: string;
  pick: (bin: BinData) => number;
};

const DATASET_META: Record<'polystrat' | 'omenstrat', DatasetMeta> = {
  omenstrat: {
    label: 'Omenstrat',
    background: OMENSTRAT_COLOR,
    border: OMENSTRAT_COLOR_BORDER,
    pick: (bin: BinData) => bin.omenstrat,
  },
  polystrat: {
    label: 'Polystrat',
    background: POLYSTRAT_COLOR,
    border: POLYSTRAT_COLOR_BORDER,
    pick: (bin: BinData) => bin.polystrat,
  },
};

type RangeTableProps = {
  range: TimeRange;
  data: RoiDistribution | null;
  platform: 'polystrat' | 'omenstrat';
  datasetMeta: DatasetMeta;
  asOf: string | null;
  isIncomplete: boolean;
};

/**
 * The distribution for one time range, as a table.
 *
 * The chart is a `<canvas>`, so it holds no text at any point, and both the range and the
 * platform live in React state — without this, nothing in the served HTML says which
 * distribution is on screen, let alone what the other three ranges hold.
 *
 * Every bin is listed rather than summarised: a distribution's shape is the answer, and a
 * headline ("most agents are between -10% and 10%") throws away the tail that makes the
 * chart worth reading. Returns null when the range has no qualifying population, so an
 * empty histogram is never described as a real one — an all-zero histogram is also what a
 * missing blob produces.
 */
const RoiRangeTable = ({
  range,
  data,
  platform,
  datasetMeta,
  asOf,
  isIncomplete,
}: RangeTableProps) => {
  const dataKey = TIME_RANGES.find((entry) => entry.key === range)?.dataKey ?? 'd7';
  const bins = data?.bins?.[dataKey] ?? null;
  const agentCount = data?.netPositive?.[dataKey]?.[platform]?.agents ?? 0;

  if (!bins || bins.length === 0 || agentCount === 0) return null;

  return (
    <table>
      {/* The caption names its own range: these tables are retrieved one at a time and
          out of order, so a caption that says only "the selected range" is useless. */}
      <caption>
        {`Trading ROI distribution for the ${agentCount} ${datasetMeta.label} agents that qualify, ${rangeLabelFor(range)}. ` +
          `Trading ROI reflects prediction performance only, excluding staking rewards, and each range sums profit and loss realised on markets that settled within it. ` +
          `Qualifying agents are those with positive trading costs${range === 'max' ? ' and at least 10 lifetime bets' : ''}; percentages are shares of that population, not of all ${datasetMeta.label} agents.` +
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
  );
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
  snapshots = {},
}: RoiDistributionChartProps) => {
  const [activeRange, setActiveRange] = useState<TimeRange>('7d');

  const activeDataKey = TIME_RANGES.find((range) => range.key === activeRange)?.dataKey ?? 'd7';
  const activeRangeLabel = rangeLabelFor(activeRange);
  const bins = data?.bins?.[activeDataKey] ?? null;
  const datasetMeta = DATASET_META[platform];

  const asOfFor = (key: 'polystrat' | 'omenstrat') =>
    formatUtcAsOf(snapshots[key]?.timestamp ?? null);
  const isIncompleteFor = (key: 'polystrat' | 'omenstrat') => snapshots[key]?.isIncomplete ?? false;

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

      {/* Screen-reader-only mirror of the active range: announced on change, and the
          only range a screen-reader user is currently looking at. */}
      <section aria-label={`${datasetMeta.label} trading ROI distribution`} className="sr-only">
        <p role="status">
          {`Showing the ${datasetMeta.label} trading ROI distribution ${activeRangeLabel}.`}
        </p>
        <RoiRangeTable
          range={activeRange}
          data={data}
          platform={platform}
          datasetMeta={datasetMeta}
          asOf={asOfFor(platform)}
          isIncomplete={isIncompleteFor(platform)}
        />
      </section>

      {/* The other seven distributions: the three ranges behind the other tabs, and all
          four for the platform the switcher is not on. Both live only in React state, so
          a crawler fetching this page once would otherwise see an eighth of the data and
          no sign that the rest exists.

          `aria-hidden` because this is a duplicate for machines: a screen-reader user has
          the active table above and can switch tabs to change it, and reading three more
          31-row tables they did not ask for would be a regression. Crawlers read the text
          of the DOM and are unaffected. */}
      <div className="sr-only" aria-hidden="true">
        {(['omenstrat', 'polystrat'] as const).map((other) =>
          TIME_RANGES.filter(({ key }) => !(other === platform && key === activeRange)).map(
            ({ key }) => (
              <RoiRangeTable
                key={`${other}-${key}`}
                range={key}
                data={data}
                platform={other}
                datasetMeta={DATASET_META[other]}
                asOf={asOfFor(other)}
                isIncomplete={isIncompleteFor(other)}
              />
            )
          )
        )}
      </div>

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
