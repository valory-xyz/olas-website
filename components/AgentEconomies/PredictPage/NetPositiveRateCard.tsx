'use client';

import type { NetPositive } from 'common-util/api/predict/roi-distribution';
import { Card } from 'components/ui/card';
import { MetricContext } from 'components/ui/MetricContext';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import { isNil } from 'lodash';

/**
 * Share of Polymarket trader wallets that are net-positive, published by Andrey
 * Sergeenkov: 15.9% of ~2.5M wallets over Apr 2024 - Apr 2026. Hard-coded on
 * purpose — it is a one-off external study, not a metric we index.
 */
const BASELINE = {
  rate: 15.9,
  label: 'Polymarket wallets',
  window: 'Apr 2024 - Apr 2026',
  // Spelled out for the machine-readable sentence, where the abbreviated
  // range reads as a subtraction.
  windowPhrase: 'April 2024 and April 2026',
  sample: '2.5 million Polymarket trader wallets',
  sourceTitle: 'How Many Traders Are Profitable on Polymarket',
  sourceUrl: 'https://sergeenkov.com/polymarket-profitability/',
};

/** The card reports one fixed window; the Performance tabs above it do not apply. */
const AGENT_WINDOW_LABEL = 'last 30d';
const AGENT_WINDOW_PHRASE = 'over the last 30 days';

const AXIS_STEP = 10;

const AGENT_COLOR = '#4D74FF';
const BASELINE_COLOR = '#94A3B8';

type NetPositiveRateCardProps = {
  /** Net-positive share for the selected 30-day window. */
  netPositive: NetPositive | null;
  className?: string;
  id?: string;
  /** As-of date for the ROI distribution blob this is derived from. */
  asOf?: number | null;
};

/** Round the axis up to the next 10% so both bars sit inside it. */
const axisMaxFor = (highest: number) =>
  Math.max(AXIS_STEP, Math.ceil(highest / AXIS_STEP) * AXIS_STEP);

const RateBar = ({ value, axisMax, color }: { value: number; axisMax: number; color: string }) => (
  <div
    className="flex h-7 min-w-[3.25rem] items-center justify-end rounded-sm pr-2"
    style={{ width: `${(value / axisMax) * 100}%`, backgroundColor: color }}
  >
    <span className="text-sm font-semibold text-white">{value.toFixed(1)}%</span>
  </div>
);

const LegendSwatch = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span className="flex items-center gap-2 text-sm text-gray-900">
    <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: color }} />
    {children}
  </span>
);

export const NetPositiveRateCard = ({
  netPositive,
  className,
  id,
  asOf = null,
}: NetPositiveRateCardProps) => {
  const rate = netPositive?.rate ?? null;

  if (isNil(rate)) return null;

  const axisMax = axisMaxFor(Math.max(rate, BASELINE.rate));
  const ticks = Array.from({ length: axisMax / AXIS_STEP + 1 }, (_, i) => i * AXIS_STEP);
  const multiplier = (rate / BASELINE.rate).toFixed(1);

  return (
    <Card
      id={id}
      className={`flex flex-col gap-6 rounded-3xl border-none bg-[#F2F4F9] p-6 ${className ?? ''}`}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart — the title sits inside the panel, above the legend */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Net-positive rate</h3>
            <Popover>
              <div className="flex max-w-[320px] flex-col gap-2 text-base text-gray-500">
                <p>
                  Share of Polystrat agents whose trading ROI was above zero over the last 30 days.
                  Uses the same per-agent ROI as the distribution below, including only agents with
                  enough trading history to be meaningful.
                </p>
                <p>
                  The baseline counts individual Polymarket wallets, not agents, and covers a longer
                  period — see the footnotes.
                </p>
              </div>
            </Popover>
          </div>

          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <LegendSwatch color={AGENT_COLOR}>Polystrat*</LegendSwatch>
              <LegendSwatch color={BASELINE_COLOR}>{BASELINE.label}**</LegendSwatch>
            </div>

            <div className="relative">
              {/* Gridlines, one per axis tick */}
              <div aria-hidden className="absolute inset-0">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className="absolute top-0 h-full w-px bg-slate-200"
                    style={{ left: `${(tick / axisMax) * 100}%` }}
                  />
                ))}
              </div>

              <div className="relative flex flex-col gap-3 py-1">
                <RateBar value={rate} axisMax={axisMax} color={AGENT_COLOR} />
                <RateBar value={BASELINE.rate} axisMax={axisMax} color={BASELINE_COLOR} />
              </div>
            </div>

            {/* Axis */}
            <div className="relative mt-2 h-5">
              {ticks.map((tick, i) => (
                <span
                  key={tick}
                  className="absolute top-0 text-sm text-slate-500"
                  style={{
                    left: `${(tick / axisMax) * 100}%`,
                    transform: i === ticks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                  }}
                >
                  {tick}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="flex flex-col justify-between gap-6">
          <p className="text-lg text-gray-900">
            Polystrat win rate vs baseline traders:{' '}
            <span className="text-2xl font-bold text-purple-600">{multiplier}x</span>
            <sup>**</sup>
          </p>

          <div className="flex flex-col gap-1 text-sm text-slate-500">
            <span>* - Polystrat reported time-range: {AGENT_WINDOW_LABEL}.</span>
            <span>
              ** - Baseline traders reported time-range: {BASELINE.window}. Source:{' '}
              <ExternalLink className="align-baseline" href={BASELINE.sourceUrl}>
                {BASELINE.sourceTitle}
              </ExternalLink>
            </span>
          </div>
        </div>
      </div>

      {/* The bars are CSS, so the whole comparison exists only here in the text
          layer. Both windows are stated inline — they differ, and the sentence is
          misleading if either is dropped. */}
      <MetricContext
        value={`${rate.toFixed(1)}%`}
        noun={`of Polystrat agents trading Polymarket prediction markets on Polygon were net-positive — their trading ROI was above zero — ${AGENT_WINDOW_PHRASE}, which is ${multiplier} times the ${BASELINE.rate}% of ${BASELINE.sample} that were net-positive between ${BASELINE.windowPhrase}`}
        asOfFallback={asOf}
      />
    </Card>
  );
};
