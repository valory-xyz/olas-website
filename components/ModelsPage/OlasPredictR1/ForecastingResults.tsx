import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import results from 'data/olasPredictR1Results.json';
import { cn } from 'lib/utils';

/**
 * Six-week evaluation of Olas-Predict-R1-14B against its base model, an unreleased
 * research variant and GPT-4.1: headline accuracy / Brier error per model, and both
 * metrics over time as markets resolved. Rendered as inline SVG from
 * `data/olasPredictR1Results.json` (the time series there were digitised from the
 * evaluation figure, so they are approximate; the headline bars are exact).
 */

type Metric = 'accuracy' | 'brier';
type ModelId = 'base' | 'research' | 'olas' | 'gpt';
type Model = (typeof results.models)[number];
/** `[ISO date, value, lower CI, upper CI]`. */
type Point = [string, number, number, number];

const INK = '#101114';
const SECONDARY = '#606f85';
const GRID = '#dfe5ee';

const SERIES_COLOR: Record<ModelId, string> = {
  base: '#929aa8',
  research: '#82b1e6',
  olas: '#7e22ce',
  gpt: '#179d78',
};
// Reference models are dashed so the four lines are told apart by more than colour.
const DASHED: ReadonlySet<ModelId> = new Set(['base', 'gpt']);

const METRIC: Record<
  Metric,
  {
    title: string;
    hint: string;
    /** y-domain of the time chart. */
    domain: [number, number];
    /** x-domain of the bar chart. */
    barDomain: [number, number];
    barTicks: number[];
    /** Sparser ticks for the narrow bar layout, where the full set collides. */
    narrowBarTicks: number[];
    lineTicks: number[];
    format: (v: number) => string;
  }
> = {
  accuracy: {
    title: 'Accuracy',
    hint: 'Higher is better',
    domain: [58.5, 80.5],
    barDomain: [60, 80],
    barTicks: [60, 65, 70, 75, 80],
    narrowBarTicks: [60, 65, 70, 75, 80],
    lineTicks: [60, 65, 70, 75, 80],
    format: (v) => `${v.toFixed(1)}%`,
  },
  brier: {
    title: 'Brier forecast error',
    hint: 'Lower is better',
    domain: [0.154, 0.29],
    barDomain: [0, 0.3],
    barTicks: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3],
    narrowBarTicks: [0, 0.1, 0.2, 0.3],
    lineTicks: [0.16, 0.18, 0.2, 0.22, 0.24, 0.26, 0.28],
    format: (v) => v.toFixed(4),
  },
};

const DATE_TICKS = ['2026-07-27', '2026-08-03', '2026-08-10', '2026-08-17', '2026-08-24'];

const formatTick = (metric: Metric, v: number) => (metric === 'accuracy' ? `${v}%` : v.toFixed(2));

const modelOf = (id: ModelId) => results.models.find((m) => m.id === id);

/** Width of the element, tracked through resizes; 0 until measured on the client. */
const useContainerWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
};

/** One bar per model. Below 400px the name sits above its bar instead of beside it. */
const BarChart = ({ metric, width }: { metric: Metric; width: number }) => {
  const { barDomain, format, title, hint } = METRIC[metric];
  const narrow = width < 400;
  const ticks = narrow ? METRIC[metric].narrowBarTicks : METRIC[metric].barTicks;
  const labelColumn = narrow ? 0 : 176;
  const rowHeight = narrow ? 74 : 52;
  const plotHeight = results.models.length * rowHeight;
  const [min, max] = barDomain;
  const x = (v: number) => labelColumn + ((v - min) / (max - min)) * (width - labelColumn - 68);

  return (
    <svg
      viewBox={`0 0 ${width} ${plotHeight + 28}`}
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label={`${title}. ${hint}.`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {ticks.map((tick) => (
        <g key={tick}>
          {!narrow && <line x1={x(tick)} y1={0} x2={x(tick)} y2={plotHeight} stroke={GRID} />}
          <text
            x={x(tick)}
            y={plotHeight + 18}
            fill={SECONDARY}
            fontSize={12}
            textAnchor={tick === min && narrow ? 'start' : 'middle'}
          >
            {formatTick(metric, tick)}
          </text>
        </g>
      ))}
      {results.models.map((model, i) => {
        const top = i * rowHeight;
        const barY = top + (narrow ? 42 : 13);
        const value = model[metric];
        const isOlas = model.id === 'olas';
        return (
          <g key={model.id} aria-label={`${model.name}, ${model.description}: ${format(value)}`}>
            <title>{`${model.name}: ${format(value)}`}</title>
            <text
              x={0}
              y={top + 19}
              fontSize={14}
              fontWeight={600}
              fill={isOlas ? SERIES_COLOR.olas : INK}
            >
              {model.name}
            </text>
            <text x={0} y={top + 36} fontSize={12} fill={SECONDARY}>
              {model.description}
            </text>
            <rect
              x={labelColumn}
              y={barY}
              width={Math.max(0, x(value) - labelColumn)}
              height={24}
              rx={2}
              fill={SERIES_COLOR[model.id as ModelId]}
            />
            <text
              x={width}
              y={barY + 17}
              fontSize={14}
              fontWeight={600}
              fill={INK}
              textAnchor="end"
            >
              {format(value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LEFT = 44;
const RIGHT = 14;
const TOP = 10;
const PLOT_HEIGHT = 202;
const LINE_HEIGHT = 242;

type Hover = { x: number; date: string; values: { model: Model; value: number }[] };

/** Every model's metric as markets resolved, with a shaded 95% confidence band. */
const TimeChart = ({ metric, width }: { metric: Metric; width: number }) => {
  const { domain, lineTicks, format, title, hint } = METRIC[metric];
  const series = results.series[metric] as { modelId: ModelId; points: Point[] }[];
  const [hover, setHover] = useState<Hover | null>(null);

  const { tMin, tMax } = useMemo(() => {
    const times = series.flatMap((s) => s.points.map((p) => Date.parse(p[0])));
    return { tMin: Math.min(...times), tMax: Math.max(...times) };
  }, [series]);

  const x = (date: string) =>
    LEFT + ((Date.parse(date) - tMin) / (tMax - tMin)) * (width - LEFT - RIGHT);
  const y = (v: number) => TOP + ((domain[1] - v) / (domain[1] - domain[0])) * PLOT_HEIGHT;

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const t = tMin + ((px - LEFT) / (width - LEFT - RIGHT)) * (tMax - tMin);
    if (t < tMin || t > tMax) {
      setHover(null);
      return;
    }
    // Nearest sample per series — the digitised series don't share an exact date grid.
    const values = series.map(({ modelId, points }) => {
      const nearest = points.reduce((best, p) =>
        Math.abs(Date.parse(p[0]) - t) < Math.abs(Date.parse(best[0]) - t) ? p : best
      );
      return { model: modelOf(modelId), value: nearest[1], date: nearest[0] };
    });
    const anchor = values.find((v) => v.model.id === 'olas') ?? values[0];
    setHover({ x: x(anchor.date), date: anchor.date, values });
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${LINE_HEIGHT}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={`${title} over time. ${hint}.`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
      >
        <desc>
          Markets scored as they resolve, from the 200th market. Shaded: 95% confidence interval.
        </desc>
        {lineTicks.map((tick) => (
          <g key={tick}>
            <line x1={LEFT} y1={y(tick)} x2={width - RIGHT} y2={y(tick)} stroke={GRID} />
            <text x={LEFT - 9} y={y(tick) + 4} fill={SECONDARY} fontSize={12} textAnchor="end">
              {formatTick(metric, tick)}
            </text>
          </g>
        ))}
        {DATE_TICKS.map((date) => (
          <text
            key={date}
            x={x(date)}
            y={235}
            fill={SECONDARY}
            fontSize={width < 320 ? 11 : 12}
            textAnchor="middle"
          >
            {dayjs(date).format('MMM D')}
          </text>
        ))}
        {series.map(({ modelId, points }) => {
          const upper = points.map((p) => `${x(p[0]).toFixed(3)},${y(p[3]).toFixed(3)}`);
          const lower = [...points]
            .reverse()
            .map((p) => `${x(p[0]).toFixed(3)},${y(p[2]).toFixed(3)}`);
          return (
            <path
              key={modelId}
              d={`M${upper.join('L')}L${lower.join('L')}Z`}
              fill={SERIES_COLOR[modelId]}
              opacity={0.1}
            />
          );
        })}
        {series.map(({ modelId, points }) => (
          <path
            key={modelId}
            d={points
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p[0]).toFixed(3)},${y(p[1]).toFixed(3)}`)
              .join('')}
            fill="none"
            stroke={SERIES_COLOR[modelId]}
            strokeWidth={modelId === 'olas' ? 3 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={DASHED.has(modelId) ? '7 5' : undefined}
          />
        ))}
        {hover && (
          <line
            x1={hover.x}
            y1={TOP}
            x2={hover.x}
            y2={TOP + PLOT_HEIGHT}
            stroke={INK}
            strokeOpacity={0.35}
          />
        )}
      </svg>
      {hover && (
        <div
          role="status"
          className="pointer-events-none absolute top-0 z-10 rounded-md border border-[#dfe5ee] bg-white px-3 py-2 text-xs shadow-md"
          style={{
            left: `${(hover.x / width) * 100}%`,
            // Flip to the left of the crosshair in the right half so it stays in the card.
            transform: hover.x > width / 2 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
          }}
        >
          <p className="mb-1 font-medium text-[#101114]">
            {dayjs(hover.date).format('MMM D, YYYY')}
          </p>
          {hover.values.map(({ model, value }) => (
            <p key={model.id} className="flex items-center gap-2 text-[#4d596a]">
              <span
                aria-hidden
                className="inline-block h-[3px] w-4 rounded-sm"
                style={{ background: SERIES_COLOR[model.id as ModelId] }}
              />
              <span>{model.name}</span>
              <strong className="ml-auto pl-3 font-semibold text-[#101114]">{format(value)}</strong>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const Legend = ({ metric }: { metric: Metric }) => (
  <ul className="grid grid-cols-1 gap-x-4 gap-y-0.5 px-4 pt-3.5 sm:grid-cols-2 sm:gap-y-2 lg:grid-cols-1 lg:gap-y-0.5 xl:grid-cols-2 xl:gap-y-2">
    {results.models.map((model) => {
      const id = model.id as ModelId;
      return (
        <li
          key={id}
          className="flex items-center gap-2 whitespace-nowrap text-sm leading-[22px] text-[#4d596a]"
        >
          <span
            aria-hidden
            className={cn(
              'w-4 shrink-0',
              DASHED.has(id) ? 'border-t-[3px] border-dashed' : 'h-[3px] rounded-sm'
            )}
            style={
              DASHED.has(id) ? { borderColor: SERIES_COLOR[id] } : { background: SERIES_COLOR[id] }
            }
          />
          <span>{model.name}</span>
          <strong
            className="ml-auto font-semibold text-[#101114]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {METRIC[metric].format(model[metric])}
          </strong>
        </li>
      );
    })}
  </ul>
);

const ChartCard = ({ metric, kind }: { metric: Metric; kind: 'bar' | 'time' }) => {
  const { ref, width } = useContainerWidth();
  const { title, hint } = METRIC[metric];
  const heading = kind === 'time' ? `${title} over time` : title;
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#dfe5ee] bg-white">
      <header className="border-b border-[#dfe5ee] px-4 py-3.5">
        <h3 className="text-xl font-semibold leading-7 tracking-[-0.2px] text-[#101114]">
          {heading}
        </h3>
        <p className="mt-1 text-sm leading-5 text-[#4d596a]">{hint}</p>
      </header>
      {kind === 'time' && <Legend metric={metric} />}
      {/* Bar cards share a row with the taller time-series cards; centring the plot fills
          the stretched height evenly instead of leaving it all below the bars. */}
      <div ref={ref} className="flex flex-1 flex-col justify-center p-4">
        {/* Charts lay out against the measured width, so nothing renders until we have it. */}
        {width > 0 &&
          (kind === 'bar' ? (
            <BarChart metric={metric} width={width} />
          ) : (
            <TimeChart metric={metric} width={width} />
          ))}
      </div>
    </article>
  );
};

export const ForecastingResults = () => {
  const olas = modelOf('olas');
  return (
    <SectionWrapper backgroundType="NONE" customClasses={`${SECTION_BOX_CLASS} bg-white`}>
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-7 text-center">
          <h2 className="mb-3 text-[28px] font-semibold leading-9 tracking-[-0.56px] text-[#101114] md:text-4xl md:leading-[44px] md:tracking-[-0.72px]">
            Forecasting results
          </h2>
          <p className="text-base leading-6 text-[#4d596a]">
            {olas.name} achieved {olas.accuracy}% accuracy across{' '}
            {results.markets.toLocaleString('en-US')} prediction markets.
          </p>
        </div>
        {/* Row per metric on md+: headline bars on the left, the time series beside them. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <ChartCard metric="accuracy" kind="bar" />
          <ChartCard metric="accuracy" kind="time" />
          <ChartCard metric="brier" kind="bar" />
          <ChartCard metric="brier" kind="time" />
        </div>
      </div>
    </SectionWrapper>
  );
};
