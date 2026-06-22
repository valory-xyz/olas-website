'use client';

import { DaaSeriesPoint } from 'common-util/explorer';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Weekday-aligned grid (GitHub-style): row = weekday (row 0 = Sunday), each column
// is one calendar week, columns advance left→right, older history scrolls left.
const ROWS = 7;
const CELL_SIZE = 28; // Figma cell: 28×28
const CELL_GAP = 4; // Figma grid gap: 4px
const PITCH = CELL_SIZE + CELL_GAP; // 32px per column / per row
const GRID_HEIGHT = ROWS * CELL_SIZE + (ROWS - 1) * CELL_GAP; // 220px
const RULER_GAP = 10; // grid → ruler
const RULER_HEIGHT = 50; // month ticks + year labels + hovered-month line/name
const SCROLLBAR_GAP = 2; // ruler → scrollbar
const SCALE_PAD = 14; // top/bottom breathing room (≥8px clear of the edge cells + the hover lift)
const AXIS_WIDTH = 52; // fixed right weekday-label gutter (16px gap + label)
const LEAD_IN = 40; // free space before the first column at the left scroll-end
const TRAIL_PAD = 10; // bleed room after the last column so the most-recent cell's
// hover zoom + highlight ring/shadow aren't clipped by the scroll container's edge

// Right-edge tunnel: an inset shadow the cells recede into, shown only when newer
// history is scrolled off-screen. Strength/blend tunable here. Left edge: none.
const EDGE_SHADOW = 'inset -22px 0 34px -16px rgba(44, 12, 74, 0.6)'; // dark plum — a touch of purple in the tunnel, not pure black
// The shadow lives in a taller, clipped layer so only its right edge shows — its
// top/bottom/left fall outside the clip, killing the "concave" look.
const SHADOW_OVERHANG = 44;

// Load wave — cells lay down like tiles, left→right across the visible window.
const WAVE_START_DELAY = 250; // ms before the entrance wave begins on first mount
const WAVE_DURATION = 600; // ms per cell
// Beautiful, fast, no-overshoot ease-out (easeOutQuint) — shared by the wave + hover.
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const WAVE_STAGGER = 14; // ms per column
const VISIBLE_COLS = 46; // ~columns in view — anchors the wave's left→right start

const TOOLTIP_DELAY = 100;
const TOOLTIP_GAP = 10;
const TOOLTIP_EST_WIDTH = 160;

const LEVELS = 8; // active levels (1..8); 0 = empty
const TICK_COLOR = '#c3ccdb';
const TICK_EVERY_COLS = 2; // ruler cadence: a tick every 2 columns ≈ half a month (2 weeks)
// Light, 6-step purple ramp ending deep (Olas brand purple family).
export const HEATMAP_LEVEL_COLORS = [
  '#dfe5ee', // 0 — empty (Figma bg/prominent)
  '#e6d7f8', // 1 ┐ evenly distributed up to #7e22ce
  '#d5b9f1', // 2 │
  '#c39bea', // 3 │
  '#b27ce3', // 4 │
  '#a15edc', // 5 │
  '#8f40d5', // 6 ┘
  '#7e22ce', // 7 — brand purple
  '#5e10a2', // 8 — deepest
];

// Alternate sequential ramps for economies with multiple agents (same empty grey at
// index 0, then 8 shades tinted light → the brand colour at level 8). Used to
// colour-code Babydegen's Optimus vs Modius heatmaps — the densest days land exactly
// on each agent's brand colour (Optimism red #FF0420 / Mode lime #C9ED29).
export const HEATMAP_LEVEL_COLORS_RED = [
  '#dfe5ee', // 0 — empty
  '#ffe1e4', // 1
  '#ffc1c8', // 2
  '#ffa2ac', // 3
  '#ff8290', // 4
  '#ff6374', // 5
  '#ff4358', // 6
  '#ff243c', // 7
  '#ff0420', // 8 — Optimism brand red
];
export const HEATMAP_LEVEL_COLORS_LIME = [
  '#dfe5ee', // 0 — empty
  '#f9fde5', // 1
  '#f2fbca', // 2
  '#ebf8b0', // 3
  '#e4f695', // 4
  '#ddf47a', // 5
  '#d7f25f', // 6
  '#d0ef44', // 7
  '#c9ed29', // 8 — Mode brand lime
];

export type HeatmapRamp = 'purple' | 'red' | 'lime';
export const HEATMAP_RAMPS: Record<HeatmapRamp, string[]> = {
  purple: HEATMAP_LEVEL_COLORS,
  red: HEATMAP_LEVEL_COLORS_RED,
  lime: HEATMAP_LEVEL_COLORS_LIME,
};

// row (0=Sun … 6=Sat) → label. All seven.
const WEEKDAY_AT_ROW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Quantile cut points (LEVELS-1 of them) so even gradual data spreads across the
// whole ramp — each level gets ~the same number of days, and the deepest shade is
// always used. Fixes the "looks flat" of linear-on-max bucketing.
const quantileThresholds = (sortedNonZero: number[]): number[] => {
  if (sortedNonZero.length === 0) return [];
  const t: number[] = [];
  for (let i = 1; i < LEVELS; i += 1) {
    const idx = Math.floor((i / LEVELS) * sortedNonZero.length);
    t.push(sortedNonZero[Math.min(idx, sortedNonZero.length - 1)]);
  }
  return t;
};

const levelFor = (count: number, thresholds: number[]): number => {
  if (count <= 0) return 0;
  let lvl = 1;
  for (let i = 0; i < thresholds.length; i += 1) {
    if (count >= thresholds[i]) lvl = i + 2;
    else break;
  }
  return Math.min(lvl, LEVELS);
};

// Diverging red↓/green↑ ramp for signed metrics (ROI): losses red, gains green,
// deeper = larger magnitude, ~0 neutral. Each side gets DIVERGING_SIDE_LEVELS
// quantile buckets so both tails spread across their ramp.
const DIVERGING_SIDE_LEVELS = 4;
export const HEATMAP_DIVERGING_COLORS = {
  neg: ['#fbe3e1', '#f1a8a3', '#e26d65', '#c5372f'], // loss — light → deep red
  pos: ['#d9efdd', '#9fd6ab', '#54b56f', '#2e9e49'], // profit — light → deep green
  zero: '#dfe5ee', // ~0 / neutral (matches the empty cell)
};

// Quantile cut points (levels-1) for an arbitrary level count — used per diverging side.
const quantileThresholdsN = (sorted: number[], levels: number): number[] => {
  if (sorted.length === 0) return [];
  const t: number[] = [];
  for (let i = 1; i < levels; i += 1) {
    const idx = Math.floor((i / levels) * sorted.length);
    t.push(sorted[Math.min(idx, sorted.length - 1)]);
  }
  return t;
};

// Bucket a non-negative magnitude into 0..thresholds.length by quantile.
const sideBucket = (magnitude: number, thresholds: number[]): number => {
  let lvl = 0;
  for (let i = 0; i < thresholds.length; i += 1) {
    if (magnitude >= thresholds[i]) lvl = i + 1;
    else break;
  }
  return lvl;
};

const divergingColor = (
  value: number,
  negThresholds: number[],
  posThresholds: number[]
): string => {
  if (value > 0) return HEATMAP_DIVERGING_COLORS.pos[sideBucket(value, posThresholds)];
  if (value < 0) return HEATMAP_DIVERGING_COLORS.neg[sideBucket(-value, negThresholds)];
  return HEATMAP_DIVERGING_COLORS.zero;
};

type ColorScale = 'sequential' | 'diverging';

type Cell = {
  key: string;
  date: string | null;
  count: number;
  inRange: boolean;
  /** True only for real calendar days present in the series (vs gap-filled days
   *  with no value — sparse metrics like accuracy leave thin days out). No-data
   *  cells render empty and aren't hoverable. */
  hasData: boolean;
  year: number;
  monthKey: string;
  col: number;
  row: number;
  level: number;
  /** Resolved background colour (sequential ramp or diverging red/green). */
  color: string;
};

type MonthTick = { key: string; label: string; x: number; year: number; isYearStart: boolean };

type Model = {
  columns: Cell[][];
  monthTicks: MonthTick[];
  monthCells: Record<string, { col: number; row: number }[]>;
  yearSpan: Record<number, { start: number; end: number }>;
  contentWidth: number;
  lastRealCol: number;
};

const EMPTY_MODEL: Model = {
  columns: [],
  monthTicks: [],
  monthCells: {},
  yearSpan: {},
  contentWidth: 0,
  lastRealCol: 0,
};

const buildModel = (
  series: DaaSeriesPoint[],
  colorScale: ColorScale = 'sequential',
  levelColors: string[] = HEATMAP_LEVEL_COLORS
): Model => {
  if (series.length === 0) return EMPTY_MODEL;

  const countByDate = new Map(series.map((point) => [point.date, point.count]));
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const start = dayjs(sorted[0].date);
  const end = dayjs(sorted[sorted.length - 1].date);
  const totalDays = end.diff(start, 'day') + 1;

  // Weekday alignment: shift every day by the start day's weekday so row = weekday.
  const startOffset = start.day(); // 0 = Sunday
  const slots = startOffset + totalDays;
  const numCols = Math.ceil(slots / ROWS);
  const lastRealCol = Math.floor((startOffset + totalDays - 1) / ROWS);

  const columns: Cell[][] = Array.from({ length: numCols }, (_, col) =>
    Array.from({ length: ROWS }, (_, row) => ({
      key: `pad-${col}-${row}`,
      date: null,
      count: 0,
      inRange: false,
      hasData: false,
      year: 0,
      monthKey: '',
      col,
      row,
      level: 0,
      color: '',
    }))
  );

  const monthTicks: MonthTick[] = [];
  const monthCells: Record<string, { col: number; row: number }[]> = {};
  const yearSpan: Record<number, { start: number; end: number }> = {};
  // Values feeding the colour ramps. Sequential ranks positive days on one purple
  // ramp (0 = empty); diverging splits data days into negative/positive magnitudes.
  const rampValues: number[] = [];
  const negValues: number[] = [];
  const posValues: number[] = [];

  for (let i = 0; i < totalDays; i += 1) {
    const day = start.add(i, 'day');
    const date = day.format('YYYY-MM-DD');
    const hasData = countByDate.has(date);
    const count = countByDate.get(date) ?? 0;
    if (colorScale === 'diverging') {
      if (hasData && count > 0) posValues.push(count);
      else if (hasData && count < 0) negValues.push(-count);
    } else if (count > 0) {
      rampValues.push(count);
    }
    const g = startOffset + i;
    const col = Math.floor(g / ROWS);
    const row = g % ROWS;
    const monthKey = day.format('YYYY-MM');
    const year = day.year();

    columns[col][row] = {
      key: date,
      date,
      count,
      inRange: true,
      hasData,
      year,
      monthKey,
      col,
      row,
      level: 0,
      color: '',
    };
    (monthCells[monthKey] ||= []).push({ col, row });

    const span = yearSpan[year];
    if (!span) yearSpan[year] = { start: col, end: col };
    else span.end = col;
  }

  // Even ruler ticks: one every TICK_EVERY_COLS columns (≈ half a month / 2 weeks).
  // Uniform spacing — calendar months aren't a whole number of weeks, so day-based
  // ticks land unevenly. Year boundaries get their own taller tick + label (yearSpan).
  for (let col = 0; col <= lastRealCol; col += TICK_EVERY_COLS) {
    monthTicks.push({ key: `tick-${col}`, label: '', x: col * PITCH, year: 0, isYearStart: false });
  }

  // Resolve each cell's colour. Diverging: red (loss) / green (profit) by quantile
  // per side, no-data → empty. Sequential: purple ramp by quantile, ≤0 → empty.
  if (colorScale === 'diverging') {
    const negT = quantileThresholdsN(
      negValues.sort((a, b) => a - b),
      DIVERGING_SIDE_LEVELS
    );
    const posT = quantileThresholdsN(
      posValues.sort((a, b) => a - b),
      DIVERGING_SIDE_LEVELS
    );
    columns.forEach((col) =>
      col.forEach((cell) => {
        if (!cell.inRange) return;
        cell.color = cell.hasData ? divergingColor(cell.count, negT, posT) : levelColors[0];
      })
    );
  } else {
    const thresholds = quantileThresholds(rampValues.sort((a, b) => a - b));
    columns.forEach((col) =>
      col.forEach((cell) => {
        if (!cell.inRange) return;
        cell.level = levelFor(cell.count, thresholds);
        cell.color = levelColors[cell.level];
      })
    );
  }

  return {
    columns,
    monthTicks,
    monthCells,
    yearSpan,
    contentWidth: numCols * PITCH - CELL_GAP,
    lastRealCol,
  };
};

type Hovered = {
  date: string;
  count: number;
  monthKey: string;
  cellLeft: number;
  cellTop: number;
  flip: boolean;
};

type DaaCalendarHeatmapProps = {
  series: DaaSeriesPoint[];
  /** Year to highlight + scroll-center; cells of other years become hollow outlines. */
  highlightYear?: number | null;
  /** Noun shown in the tooltip, e.g. "active agents" or "transactions". */
  unitLabel?: string;
  /** How the tooltip value reads: "658 active agents", "62% accuracy", or "$1,234". */
  valueKind?: 'count' | 'percent' | 'usd';
  /** 'diverging' = red/green for signed values (ROI); 'sequential' = purple, ≤0 empty. */
  colorScale?: ColorScale;
  /** Sequential ramp (index 0 = empty, 1..8 = light→deep). Defaults to the purple ramp. */
  levelColors?: string[];
  /** "Mode" — bucket colours from the visible window, not the whole history. */
  localMode?: boolean;
  /** A single date (YYYY-MM-DD) drawn specially — e.g. an agent's phase-out day. */
  markerDate?: string | null;
  /** Tooltip text shown for the marker cell instead of its metric value. */
  markerLabel?: string;
  className?: string;
  id?: string;
};

export const DaaCalendarHeatmap = ({
  series,
  highlightYear = null,
  unitLabel = 'active agents',
  valueKind = 'count',
  colorScale = 'sequential',
  levelColors = HEATMAP_LEVEL_COLORS,
  localMode = false,
  markerDate = null,
  markerLabel = '',
  className,
  id,
}: DaaCalendarHeatmapProps) => {
  const { columns, monthTicks, monthCells, yearSpan, contentWidth, lastRealCol } = useMemo(
    () => buildModel(series, colorScale, levelColors),
    [series, colorScale, levelColors]
  );

  // All cells, flat — each Cell already carries its own col/row.
  const flatCells = useMemo(() => columns.flat(), [columns]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState<Hovered | null>(null);
  const [tipShown, setTipShown] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fade, setFade] = useState({ left: 0, right: 0 });
  const [reduced, setReduced] = useState(false);
  // Local "Mode": quantile thresholds from the cells currently in view (null = global).
  const [localThresholds, setLocalThresholds] = useState<number[] | null>(null);
  const localTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Entrance wave plays once, on first mount (the page-load animation); then we drop
  // the animation so a metric switch is seamless — the cells stay mounted and just
  // recolour via the `.heatmap-cell` background-color transition (no flicker, no re-wave).
  const [firstWave, setFirstWave] = useState(true);
  const didScroll = useRef(false);

  const tipShownRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Drop the entrance wave once it has finished, so later renders (metric switches)
  // carry no animation — only the background-color recolour transition.
  useEffect(() => {
    if (reduced) {
      setFirstWave(false);
      return undefined;
    }
    const total = WAVE_START_DELAY + VISIBLE_COLS * WAVE_STAGGER + WAVE_DURATION + 100;
    const t = setTimeout(() => setFirstWave(false), total);
    return () => clearTimeout(t);
  }, [reduced]);

  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setFade({
      left: Math.min(1, el.scrollLeft / 24),
      right: maxScroll <= 0 ? 0 : Math.min(1, (maxScroll - el.scrollLeft) / 24),
    });
  }, []);

  // Local "Mode": quantile thresholds from the cells currently in view, so a
  // uniformly-busy window still shows internal contrast. Cheap — only the visible
  // window's counts, recomputed when scrolling settles (debounced in handleScroll).
  const recomputeLocal = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const c0 = Math.floor((el.scrollLeft - LEAD_IN) / PITCH);
    const c1 = Math.ceil((el.scrollLeft - LEAD_IN + el.clientWidth) / PITCH);
    const counts: number[] = [];
    flatCells.forEach((cell) => {
      if (cell.inRange && cell.count > 0 && cell.col >= c0 && cell.col <= c1) {
        counts.push(cell.count);
      }
    });
    setLocalThresholds(counts.length ? quantileThresholds(counts.sort((a, b) => a - b)) : null);
  }, [flatCells]);

  const handleScroll = useCallback(() => {
    updateFade();
    if (!localMode) return;
    if (localTimer.current) clearTimeout(localTimer.current);
    localTimer.current = setTimeout(recomputeLocal, 90);
  }, [updateFade, localMode, recomputeLocal]);

  // Recompute on toggle (and clear back to the global ramp when off).
  useEffect(() => {
    if (localMode) recomputeLocal();
    else setLocalThresholds(null);
  }, [localMode, recomputeLocal]);

  // Land on the most recent column on first mount (keep position on metric switch).
  useEffect(() => {
    const el = scrollRef.current;
    if (el && !didScroll.current) {
      el.scrollLeft = el.scrollWidth;
      didScroll.current = true;
    }
    updateFade();
  }, [columns, updateFade]);

  // Clicking a year scrolls + centers its column span.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || highlightYear === null) return;
    const span = yearSpan[highlightYear];
    if (!span) return;
    const centerX = LEAD_IN + ((span.start + span.end) / 2) * PITCH + CELL_SIZE / 2;
    el.scrollTo({ left: Math.max(0, centerX - el.clientWidth / 2), behavior: 'smooth' });
  }, [highlightYear, yearSpan]);

  // ---- Tooltip ---- (stable handler so the memoized grid never re-creates its cells)
  const onCellEnter = useCallback(
    (cell: Cell) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (dragRef.current || !cell.hasData || !cell.date) return;
      const wrap = wrapperRef.current?.getBoundingClientRect();
      if (!wrap) return;
      const box = e.currentTarget.getBoundingClientRect();
      const cellLeft = box.left - wrap.left;
      const cellTop = box.top - wrap.top;
      const flip = cellLeft + CELL_SIZE + TOOLTIP_GAP + TOOLTIP_EST_WIDTH > wrap.width;
      setHovered({
        date: cell.date,
        count: cell.count,
        monthKey: cell.monthKey,
        cellLeft,
        cellTop,
        flip,
      });
      if (!tipShownRef.current && tipTimer.current === null) {
        tipTimer.current = setTimeout(() => {
          tipShownRef.current = true;
          setTipShown(true);
          tipTimer.current = null;
        }, TOOLTIP_DELAY);
      }
    },
    []
  );

  const clearHover = () => {
    if (tipTimer.current) {
      clearTimeout(tipTimer.current);
      tipTimer.current = null;
    }
    tipShownRef.current = false;
    setTipShown(false);
    setHovered(null);
  };

  useEffect(
    () => () => {
      if (tipTimer.current) clearTimeout(tipTimer.current);
      if (localTimer.current) clearTimeout(localTimer.current);
    },
    []
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateFade);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateFade]);

  // Vertical wheel → horizontal pan while the pointer is over the strip (it has no
  // vertical overflow, so claiming the wheel is safe). At the track ends we let the
  // wheel fall through so the page can still scroll past the heatmap.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 0.5;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return; // let the page scroll
      el.scrollLeft += delta;
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Hovered month footprint → a purple line on the ruler spanning its columns.
  const monthSpan = useMemo(() => {
    if (!hovered) return null;
    const list = monthCells[hovered.monthKey];
    if (!list || list.length === 0) return null;
    let c0 = Infinity;
    let c1 = -Infinity;
    for (const { col } of list) {
      if (col < c0) c0 = col;
      if (col > c1) c1 = col;
    }
    const left = c0 * PITCH;
    const right = c1 * PITCH + CELL_SIZE;
    return { left, width: right - left, centerX: (left + right) / 2 };
  }, [hovered, monthCells]);

  // Memoized cell grid — only rebuilds when the data or wave state changes, so
  // scroll / hover / drag re-renders never re-create the ~1.3k cells (the hot path).
  const grid = useMemo(
    () =>
      flatCells.map((cell) => {
        const dimmed = highlightYear !== null && cell.inRange && cell.year !== highlightYear;
        // Local "Mode" only reshades sequential metrics; diverging (ROI) keeps its
        // precomputed red/green colour. Otherwise use the cell's resolved colour.
        const bg =
          colorScale === 'sequential' && localMode && localThresholds
            ? levelColors[levelFor(cell.count, localThresholds)]
            : cell.color;
        const waveDelay =
          WAVE_START_DELAY + Math.max(0, cell.col - (lastRealCol - VISIBLE_COLS)) * WAVE_STAGGER;
        const anim =
          reduced || !firstWave
            ? undefined
            : `heatmap-cell-in ${WAVE_DURATION}ms ${EASE_OUT} ${waveDelay}ms backwards`;
        // Marker cell (e.g. an agent's phase-out day): drawn as a ringed circle so it
        // stands out as the series' end-point, with its own tooltip copy.
        const isMarker = markerDate != null && cell.inRange && cell.date === markerDate;
        return (
          <div
            key={cell.key}
            className={cell.hasData ? 'heatmap-cell' : undefined}
            onMouseEnter={cell.hasData ? onCellEnter(cell) : undefined}
            style={{
              position: 'absolute',
              left: cell.col * PITCH,
              top: cell.row * PITCH,
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxSizing: 'border-box',
              borderRadius: isMarker ? '50%' : 7,
              cursor: cell.hasData ? 'pointer' : 'default',
              backgroundColor: cell.inRange && !dimmed ? bg : 'transparent',
              border: dimmed ? '1px dashed #c3ccdb' : undefined,
              boxShadow: isMarker && !dimmed ? '0 0 0 2px #fff, 0 0 0 4px #0f172a' : undefined,
              zIndex: isMarker ? 5 : undefined,
              animation: anim,
            }}
          />
        );
      }),
    [
      flatCells,
      highlightYear,
      localMode,
      localThresholds,
      levelColors,
      colorScale,
      lastRealCol,
      reduced,
      firstWave,
      markerDate,
      onCellEnter,
    ]
  );

  // Drag-to-pan in the band below the grid.
  const onBandPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollRef.current;
    if (!el) return;
    clearHover();
    dragRef.current = { x: e.clientX, left: el.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onBandPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!dragRef.current || !el) return;
    el.scrollLeft = dragRef.current.left - (e.clientX - dragRef.current.x);
  };
  const onBandPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (columns.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        Data not yet available
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={`heatmap-section relative flex w-full ${className ?? ''}`}
    >
      <div
        ref={scrollRef}
        className="heatmap-scroll min-w-0 flex-1 overflow-x-auto"
        style={{
          paddingTop: SCALE_PAD,
          paddingBottom: SCALE_PAD,
          paddingLeft: LEAD_IN,
          paddingRight: TRAIL_PAD,
        }}
        onScroll={handleScroll}
        onPointerLeave={clearHover}
      >
        <div ref={contentRef} className="relative" style={{ width: contentWidth }}>
          {/* Cells — absolute-positioned, memoized (see `grid`). Deliberately NOT keyed
              by metric: a switch keeps the same nodes so they recolour seamlessly. */}
          <div className="relative" style={{ width: contentWidth, height: GRID_HEIGHT }}>
            {grid}
          </div>

          {/* Ruler + drag band */}
          <div
            className={`relative ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ width: contentWidth, height: RULER_GAP + RULER_HEIGHT + SCROLLBAR_GAP }}
            onPointerDown={onBandPointerDown}
            onPointerMove={onBandPointerMove}
            onPointerUp={onBandPointerUp}
            onPointerCancel={onBandPointerUp}
          >
            {monthTicks.map((tick) => (
              <div
                key={tick.key}
                className="absolute"
                style={{
                  left: tick.x,
                  top: RULER_GAP + 8,
                  width: 1,
                  height: 7,
                  backgroundColor: TICK_COLOR,
                }}
              />
            ))}
            {Object.entries(yearSpan).map(([year, span]) => (
              <div
                key={`yt-${year}`}
                className="absolute"
                style={{
                  left: span.start * PITCH,
                  top: RULER_GAP + 8,
                  width: 1,
                  height: 13,
                  backgroundColor: TICK_COLOR,
                }}
              />
            ))}
            {Object.entries(yearSpan).map(([year, span]) => (
              <span
                key={`yl-${year}`}
                className="absolute text-sm text-[#606f85]"
                style={{ left: span.start * PITCH, top: RULER_GAP + 30 }}
              >
                {year}
              </span>
            ))}

            {hovered && monthSpan && (
              <>
                <div
                  className="absolute bg-[#c3ccdb]"
                  style={{
                    left: monthSpan.left,
                    top: RULER_GAP,
                    width: monthSpan.width,
                    height: 4,
                  }}
                />
                <span
                  className="absolute -translate-x-1/2 whitespace-nowrap text-[13px] font-normal text-[#475569]"
                  style={{ left: monthSpan.centerX, top: RULER_GAP + 10 }}
                >
                  {dayjs(`${hovered.monthKey}-01`).format('MMMM YYYY')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fixed right weekday-label gutter (clean — cells clip into the tunnel before it) */}
      <div className="shrink-0" style={{ width: AXIS_WIDTH, paddingTop: SCALE_PAD }}>
        {Array.from({ length: ROWS }, (_, row) => (
          <div
            key={row}
            className="flex items-center pl-4 text-sm text-[#606f85]"
            style={{ height: CELL_SIZE, marginBottom: row < ROWS - 1 ? CELL_GAP : 0 }}
          >
            {WEEKDAY_AT_ROW[row]}
          </div>
        ))}
      </div>

      {/* Right-edge tunnel — inset shadow in a taller clipped layer so only the
          right edge shows (no top/bottom concavity); appears only when newer
          history is scrolled off-screen. Left edge: no effect. */}
      <div
        className="pointer-events-none absolute z-10 overflow-hidden"
        style={{
          left: 0,
          right: AXIS_WIDTH,
          top: SCALE_PAD,
          height: GRID_HEIGHT,
          opacity: fade.right,
          transition: 'opacity 160ms ease',
        }}
      >
        <div
          className="absolute"
          style={{
            top: -SHADOW_OVERHANG,
            bottom: -SHADOW_OVERHANG,
            left: -SHADOW_OVERHANG,
            right: 0,
            boxShadow: EDGE_SHADOW,
          }}
        />
      </div>

      {/* Tooltip — white card, gray date over a medium-weight count */}
      {hovered && tipShown && (
        <div
          className={`pointer-events-none absolute z-20 flex -translate-y-1/2 flex-col gap-0.5 whitespace-nowrap rounded-[10px] bg-white px-3 py-2 ${
            hovered.flip ? '-translate-x-full' : ''
          }`}
          style={{
            left: hovered.flip
              ? hovered.cellLeft - TOOLTIP_GAP
              : hovered.cellLeft + CELL_SIZE + TOOLTIP_GAP,
            top: hovered.cellTop + CELL_SIZE / 2,
            border: '1px solid rgba(92, 99, 102, 0.18)',
            boxShadow:
              '0 31px 4.5px rgba(92,99,102,0), 0 20px 4px rgba(92,99,102,0.03), 0 11px 3.5px rgba(92,99,102,0.1), 0 5px 2.5px rgba(92,99,102,0.17), 0 1px 1.5px rgba(92,99,102,0.2)',
          }}
        >
          <span className="text-[12px] leading-4 text-[#606f85]">
            {dayjs(hovered.date).format('DD MMM, YYYY')}
          </span>
          <span className="text-[14px] font-medium leading-5 text-black">
            {markerDate && hovered.date === markerDate && markerLabel
              ? markerLabel
              : valueKind === 'percent'
                ? `${hovered.count}% ${unitLabel}`
                : valueKind === 'usd'
                  ? `$${hovered.count.toLocaleString('en-US')}`
                  : `${hovered.count.toLocaleString('en-US')} ${unitLabel}`}
          </span>
        </div>
      )}
    </div>
  );
};
