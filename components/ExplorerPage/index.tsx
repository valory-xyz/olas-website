import { useMemo, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';

import type { ExplorerSeries } from 'common-util/api/explorer';
import type { MetricStatus } from 'common-util/graphql/types';
import {
  DaaCalendarHeatmap,
  HEATMAP_DIVERGING_COLORS,
  HEATMAP_LEVEL_COLORS,
} from 'components/ExplorerPage/DaaCalendarHeatmap';
import { EconomySelector } from 'components/ExplorerPage/EconomySelector';
import { MetricSelector, type ExplorerMetric } from 'components/ExplorerPage/MetricSelector';
import { YearFilter } from 'components/ExplorerPage/YearFilter';

type ExplorerProps = {
  series: ExplorerSeries;
  status?: MetricStatus | null;
};

// Metric → the daily series it drives, the noun used in the header/tooltip, how the
// tooltip value reads (count vs percent), and the heatmap colour scale (sequential
// purple for non-negative counts/%, diverging red/green for ROI which can go negative).
const METRIC_CONFIG = {
  daa: { label: 'Daily Active Agents', unit: 'active agents', kind: 'count', scale: 'sequential' },
  transactions: {
    label: 'Total Transactions',
    unit: 'transactions',
    kind: 'count',
    scale: 'sequential',
  },
  accuracy: {
    label: 'Avg Prediction Accuracy',
    unit: 'accuracy',
    kind: 'percent',
    scale: 'sequential',
  },
  roi: { label: 'Avg Trading ROI', unit: 'ROI', kind: 'percent', scale: 'diverging' },
} as const;

type SeriesMetricKey = keyof typeof METRIC_CONFIG;

const formatCount = (n: number) => n.toLocaleString('en-US');

const LegendSwatches = ({ colors }: { colors: string[] }) => (
  <div className="flex items-center gap-1">
    {colors.map((color, i) => (
      <span
        key={`${color}-${i}`}
        style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: color }}
      />
    ))}
  </div>
);

const Legend = ({ scale }: { scale: 'sequential' | 'diverging' }) => {
  const wrap = 'flex items-center justify-center gap-4 pt-2 text-sm text-[#606f85]';
  if (scale === 'diverging') {
    // deep red → light red → neutral → light green → deep green
    const colors = [...HEATMAP_DIVERGING_COLORS.neg]
      .reverse()
      .concat(HEATMAP_DIVERGING_COLORS.zero, HEATMAP_DIVERGING_COLORS.pos);
    return (
      <div className={wrap}>
        <span>Loss</span>
        <LegendSwatches colors={colors} />
        <span>Profit</span>
      </div>
    );
  }
  return (
    <div className={wrap}>
      <span>Less</span>
      <LegendSwatches colors={HEATMAP_LEVEL_COLORS} />
      <span>More</span>
    </div>
  );
};

// tabler:filter-filled — matches the filled funnel in the Figma filter pill.
const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="shrink-0 text-[#475569]"
  >
    <path d="M20 3a1 1 0 0 1 .967 1.255l-.007 .025l-2.66 8.872a1 1 0 0 1 -.265 .44l-.09 .078l-3.945 3.16l-.001 3.17a1 1 0 0 1 -.4 .8l-.082 .055l-2 1.2c-.616 .37 -1.395 -.04 -1.504 -.726l-.011 -.124l-.001 -5.331l-3.945 -3.16a1 1 0 0 1 -.327 -.482l-.026 -.103l-2.66 -8.872a1 1 0 0 1 .862 -1.274l.103 -.006h18z" />
  </svg>
);

const Explorer = ({ series, status }: ExplorerProps) => {
  const [activeEconomy, setActiveEconomy] = useState('predict');
  const [activeMetric, setActiveMetric] = useState<SeriesMetricKey>('daa');
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const activeSeries = useMemo(() => series?.[activeMetric] ?? [], [series, activeMetric]);

  const years = useMemo(
    () => Array.from(new Set(activeSeries.map((p) => dayjs(p.date).year()))).sort((a, b) => a - b),
    [activeSeries]
  );

  // Headline tile values from the real series.
  const daaSeries = series?.daa ?? [];
  const txSeries = series?.transactions ?? [];
  const accuracySeries = series?.accuracy ?? [];
  const roiSeries = series?.roi ?? [];
  const latestDaa = daaSeries.length ? daaSeries[daaSeries.length - 1].count : 0;
  const totalTx = txSeries.reduce((sum, p) => sum + p.count, 0);
  // Headline accuracy/ROI = mean of the daily values we have data for (unweighted).
  const avgAccuracy = accuracySeries.length
    ? Math.round(accuracySeries.reduce((sum, p) => sum + p.count, 0) / accuracySeries.length)
    : null;
  const avgRoi = roiSeries.length
    ? Math.round(roiSeries.reduce((sum, p) => sum + p.count, 0) / roiSeries.length)
    : null;

  const metrics: ExplorerMetric[] = [
    { key: 'daa', label: 'Daily Active Agents', value: formatCount(latestDaa), selectable: true },
    {
      key: 'transactions',
      label: 'Total Transactions',
      value: formatCount(totalTx),
      selectable: true,
    },
    {
      key: 'accuracy',
      label: 'Avg Prediction Accuracy',
      value: avgAccuracy === null ? '--' : `${avgAccuracy}%`,
      selectable: accuracySeries.length > 0,
    },
    {
      key: 'roi',
      label: 'Avg Trading ROI',
      value: avgRoi === null ? '--' : `${avgRoi}%`,
      selectable: roiSeries.length > 0,
    },
  ];

  const handleMetric = (key: string) => {
    if (key in METRIC_CONFIG) setActiveMetric(key as SeriesMetricKey);
  };

  return (
    <>
      {/* Hero (Figma 20614:31341) — compact; title kept for page context. */}
      <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-white to-[#e9eff7] px-10 py-20 text-center">
        <h1 className="text-[48px] font-semibold leading-[56px] tracking-[-0.96px] text-black">
          Agent Economy Explorer
        </h1>
        <p className="text-lg leading-7 text-gray-600">
          Visual, time-aware view of Olas agent-economy activity.
        </p>
      </div>

      {/* Economy selector */}
      <div className="flex justify-center pb-10 pt-12">
        <EconomySelector activeKey={activeEconomy} onChange={setActiveEconomy} />
      </div>

      {/* Metric tiles — full-width band with centered 872 rails; active drives the heatmap */}
      <MetricSelector metrics={metrics} activeKey={activeMetric} onChange={handleMetric} />

      {/* Series header + filter pill — centered 872 column (Figma 20754:3512).
          Keyed by metric so the copy re-reveals on a DAA ↔ Transactions switch. */}
      <div className="flex w-full justify-center px-10 py-8">
        <div
          key={activeMetric}
          className="explorer-reveal flex w-full max-w-[872px] flex-col gap-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-medium leading-7 text-black">
              {METRIC_CONFIG[activeMetric].label}
            </span>
            <span className="text-lg leading-7 text-black">·</span>
            <span className="flex items-center gap-2">
              <Image
                src="/images/predict-page/omenstrat-icon.png"
                width={24}
                height={24}
                alt=""
                className="rounded-md"
              />
              <span className="text-sm text-black">Omenstrat</span>
            </span>
            {status?.stale && <span className="text-xs text-amber-600">· data may be delayed</span>}
          </div>

          <div className="flex w-full items-center gap-1 rounded-[10px] bg-[#f2f4f9] px-4 py-1.5">
            <FilterIcon />
            <YearFilter
              years={years}
              activeYear={activeYear}
              onChange={(year) => setActiveYear((cur) => (cur === year ? null : year))}
            />
          </div>
        </div>
      </div>

      {/* Heatmap — full-bleed left; 40px free on the right (past the weekday axis) */}
      <div className="w-full pr-10">
        <DaaCalendarHeatmap
          series={activeSeries}
          highlightYear={activeYear}
          unitLabel={METRIC_CONFIG[activeMetric].unit}
          valueKind={METRIC_CONFIG[activeMetric].kind}
          colorScale={METRIC_CONFIG[activeMetric].scale}
        />
      </div>

      {/* Legend — centered, below the heatmap */}
      <div className="mx-auto mb-20 mt-4 w-full max-w-[872px] px-4">
        <Legend scale={METRIC_CONFIG[activeMetric].scale} />
      </div>
    </>
  );
};

export default Explorer;
