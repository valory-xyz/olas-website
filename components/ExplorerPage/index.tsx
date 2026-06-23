import dayjs from 'dayjs';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { MODIUS_FIXED_END_DATE_UTC } from 'common-util/constants';
import { DaaSeriesPoint } from 'common-util/explorer';
import type { MetricStatus } from 'common-util/graphql/types';
import {
  DaaCalendarHeatmap,
  HEATMAP_DIVERGING_COLORS,
  HEATMAP_RAMPS,
  type HeatmapRamp,
} from 'components/ExplorerPage/DaaCalendarHeatmap';
import { EconomySelector } from 'components/ExplorerPage/EconomySelector';
import { MetricSelector, type ExplorerMetric } from 'components/ExplorerPage/MetricSelector';
import { YearFilter } from 'components/ExplorerPage/YearFilter';
import { cn } from 'lib/utils';

/** One agent's heatmap data: metric-key → daily series, plus its staleness status. */
type AgentData = {
  series: Record<string, DaaSeriesPoint[]>;
  status?: MetricStatus | null;
};

/**
 * All economies the Explorer can show: economy id → agent id → that agent's data.
 * Single-agent economies (Predict → Omenstrat) have one entry; multi-agent ones
 * (Babydegen → Optimus + Modius) have several, surfaced via a sub-toggle.
 */
export type ExplorerEconomies = Record<string, Record<string, AgentData>>;

type ExplorerProps = {
  economies: ExplorerEconomies;
};

type MetricKind = 'count' | 'percent' | 'usd';
type ColorScale = 'sequential' | 'diverging';

const formatCount = (n: number) => n.toLocaleString('en-US');
const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

type MetricDef = {
  label: string;
  /** Noun shown in the tooltip ('' for self-formatting kinds like USD). */
  unit: string;
  /** How the tooltip value reads: count, percent, or USD. */
  kind: MetricKind;
  /** Heatmap colour scale (sequential purple, or diverging red/green for signed values). */
  scale: ColorScale;
  /** Headline tile value derived from the metric's series. */
  headline: (series: DaaSeriesPoint[]) => string;
  /** Whether the tile is selectable — false dims it + shows "coming soon". */
  selectable: (series: DaaSeriesPoint[]) => boolean;
};

// Metric → the noun used in the header/tooltip, how the tooltip value reads, the heatmap
// colour scale, and how the headline tile value is computed from its daily series.
const METRIC_CONFIG: Record<string, MetricDef> = {
  daa: {
    label: 'Daily Active Agents',
    unit: 'active agents',
    kind: 'count',
    scale: 'sequential',
    // Latest day's active-agent count.
    headline: (s) => formatCount(s.length ? s[s.length - 1].count : 0),
    selectable: () => true,
  },
  transactions: {
    label: 'Total Transactions',
    unit: 'transactions',
    kind: 'count',
    scale: 'sequential',
    headline: (s) => formatCount(s.reduce((sum, p) => sum + p.count, 0)),
    selectable: () => true,
  },
  accuracy: {
    label: 'Avg Prediction Accuracy',
    unit: 'accuracy',
    kind: 'percent',
    scale: 'sequential',
    // Unweighted mean of the daily win-rates we have data for.
    headline: (s) =>
      s.length ? `${Math.round(s.reduce((sum, p) => sum + p.count, 0) / s.length)}%` : '--',
    selectable: (s) => s.length > 0,
  },
  aum: {
    label: 'Assets Under Management',
    unit: '',
    kind: 'usd',
    scale: 'sequential',
    // Latest day's total funded AUM (USD).
    headline: (s) => (s.length ? formatUsd(s[s.length - 1].count) : '--'),
    selectable: (s) => s.length > 0,
  },
};

type AgentMeta = {
  key: string;
  label: string;
  icon: string;
  ramp: HeatmapRamp;
  /** Phase-out date (YYYY-MM-DD) — its final cell is marked as the retirement day. */
  phaseOutDate?: string;
};
type EconomyMeta = { metrics: string[]; agents: AgentMeta[] };

// Per-economy ordered metric tiles + its agents (label/icon + heatmap colour ramp).
// The active metric resets to the first key on an economy switch; the active agent
// resets to the economy's first agent. Babydegen colour-codes Optimus (red) vs Modius
// (lime); Predict (purple) and Mech (teal) are single-agent.
const ECONOMY_META: Record<string, EconomyMeta> = {
  predict: {
    metrics: ['daa', 'transactions', 'accuracy'],
    agents: [
      {
        key: 'omenstrat',
        label: 'Omenstrat',
        icon: '/images/predict-page/omenstrat-icon.png',
        ramp: 'purple',
      },
    ],
  },
  babydegen: {
    metrics: ['daa', 'transactions', 'aum'],
    agents: [
      {
        key: 'optimus',
        label: 'Optimus',
        icon: '/images/explorer/optimus.png',
        ramp: 'red',
      },
      {
        key: 'modius',
        label: 'Modius',
        icon: '/images/explorer/modius.png',
        ramp: 'lime',
        phaseOutDate: MODIUS_FIXED_END_DATE_UTC.slice(0, 10),
      },
    ],
  },
  mech: {
    metrics: ['daa', 'transactions'],
    agents: [
      {
        key: 'mech',
        label: 'Mech',
        icon: '/images/explorer/mech.png',
        ramp: 'teal',
      },
    ],
  },
};

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

const Legend = ({ scale, rampColors }: { scale: ColorScale; rampColors: string[] }) => {
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
      <LegendSwatches colors={rampColors} />
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

const Explorer = ({ economies }: ExplorerProps) => {
  const [activeEconomy, setActiveEconomy] = useState('predict');
  const [activeAgent, setActiveAgent] = useState('omenstrat');
  const [activeMetric, setActiveMetric] = useState('daa');
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const economyMeta = ECONOMY_META[activeEconomy] ?? ECONOMY_META.predict;
  const agentMeta = economyMeta.agents.find((a) => a.key === activeAgent) ?? economyMeta.agents[0];
  const status = economies[activeEconomy]?.[agentMeta.key]?.status ?? null;
  const metricConfig = METRIC_CONFIG[activeMetric] ?? METRIC_CONFIG.daa;
  const rampColors = HEATMAP_RAMPS[agentMeta.ramp];

  // Stable ref (empty-object fallback would otherwise be a new ref each render).
  const series = useMemo(
    () => economies[activeEconomy]?.[agentMeta.key]?.series ?? {},
    [economies, activeEconomy, agentMeta.key]
  );

  const activeSeries = useMemo(() => series?.[activeMetric] ?? [], [series, activeMetric]);

  const years = useMemo(
    () => Array.from(new Set(activeSeries.map((p) => dayjs(p.date).year()))).sort((a, b) => a - b),
    [activeSeries]
  );

  // Headline tile values for this economy's metrics, computed from their real series.
  const metrics: ExplorerMetric[] = economyMeta.metrics.map((key) => {
    const config = METRIC_CONFIG[key];
    const metricSeries = series[key] ?? [];
    return {
      key,
      label: config.label,
      value: config.headline(metricSeries),
      selectable: config.selectable(metricSeries),
    };
  });

  const handleEconomy = (key: string) => {
    if (!(key in ECONOMY_META)) return;
    setActiveEconomy(key);
    // Reset to the economy's first agent + metric and clear the year filter (the new
    // economy's agents/metrics/date-range differ, so stale selections could blank it).
    setActiveAgent(ECONOMY_META[key].agents[0].key);
    setActiveMetric(ECONOMY_META[key].metrics[0]);
    setActiveYear(null);
  };

  const handleAgent = (key: string) => {
    setActiveAgent(key);
    // Agents share the economy's metrics, so keep the metric — just reset the year
    // filter since the new agent's date range may not cover the selected year.
    setActiveYear(null);
  };

  const handleMetric = (key: string) => {
    if (!(key in METRIC_CONFIG)) return;
    setActiveMetric(key);
    // Reset the year filter: the new metric may not cover the selected year, which
    // would otherwise dim every cell (blank heatmap) with no visible tab to un-toggle.
    setActiveYear(null);
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
      <div className="flex justify-center px-3 pb-10 pt-12">
        <EconomySelector activeKey={activeEconomy} onChange={handleEconomy} />
      </div>

      {/* Agent sub-toggle — only for multi-agent economies (e.g. Babydegen → Optimus /
          Modius). Each agent has its own colour ramp; selecting one repaints the tiles
          + heatmap from that agent's series. */}
      {economyMeta.agents.length > 1 && (
        <div className="flex justify-center px-3 pb-10">
          <div
            role="tablist"
            aria-label="Agent"
            className="inline-flex items-center gap-0.5 rounded-[10px] border border-[#d7ddea] bg-white p-0.5"
          >
            {economyMeta.agents.map((agent) => {
              const isActive = agent.key === agentMeta.key;
              return (
                <button
                  key={agent.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleAgent(agent.key)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-6 py-1.5 text-sm transition-colors sm:text-base',
                    isActive ? 'bg-[#dfe5ee] text-black' : 'text-[#606f85] hover:bg-slate-50'
                  )}
                >
                  <span className="relative size-5 shrink-0 overflow-hidden rounded-md sm:size-6">
                    <Image src={agent.icon} alt="" fill sizes="24px" className="object-cover" />
                  </span>
                  <span>{agent.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Metric tiles — full-width band with centered 872 rails; active drives the heatmap */}
      <MetricSelector metrics={metrics} activeKey={activeMetric} onChange={handleMetric} />

      {/* Series header + filter pill — centered 872 column (Figma 20754:3512).
          Keyed by metric so the copy re-reveals on a DAA ↔ Transactions switch. */}
      <div className="flex w-full justify-center px-6 py-8 md:px-10">
        <div
          key={`${activeEconomy}-${agentMeta.key}-${activeMetric}`}
          className="explorer-reveal flex w-full max-w-[872px] flex-col gap-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-medium leading-7 text-black">{metricConfig.label}</span>
            <span className="text-lg leading-7 text-black">·</span>
            <span className="flex items-center gap-2">
              <Image src={agentMeta.icon} width={24} height={24} alt="" className="rounded-md" />
              <span className="text-sm text-black">{agentMeta.label}</span>
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

      {/* Heatmap — full-bleed left; right gutter past the weekday axis (16px mobile, 40px md+) */}
      <div className="w-full pr-4 md:pr-10">
        <DaaCalendarHeatmap
          series={activeSeries}
          highlightYear={activeYear}
          unitLabel={metricConfig.unit}
          valueKind={metricConfig.kind}
          colorScale={metricConfig.scale}
          levelColors={rampColors}
          markerDate={agentMeta.phaseOutDate ?? null}
          markerLabel={agentMeta.phaseOutDate ? `${agentMeta.label} phased out` : undefined}
        />
      </div>

      {/* Legend — centered, below the heatmap */}
      <div className="mx-auto mb-20 mt-4 w-full max-w-[872px] px-4">
        <Legend scale={metricConfig.scale} rampColors={rampColors} />
      </div>
    </>
  );
};

export default Explorer;
