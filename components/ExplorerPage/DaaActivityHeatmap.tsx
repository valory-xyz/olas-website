'use client';

import { DaaSeriesPoint } from 'common-util/explorer';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef } from 'react';

// GitHub-contributions geometry. Kept small so many weeks fit; the grid scrolls
// horizontally and fades out at both edges (see EDGE_FADE).
const CELL_SIZE = 13; // px — width/height of each day square
const CELL_GAP = 3; // px — gap between squares (and between week columns)
const WEEKDAY_LABEL_WIDTH = 28; // px — left gutter for the Mon/Wed/Fri labels
const MONTH_ROW_HEIGHT = 14; // px — height reserved for the month labels row

// Horizontal fade so the time axis "disappears" into the card background at the
// scroll edges, mirroring the homepage "As seen in" marquee. A mask (rather than
// a flat-color overlay) lets the squares fade to transparent over the card's
// gradient background.
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)';

// Level 0 is a day with no activity (gray); levels 1–4 are increasing volume,
// shaded in Tailwind purple-500 (#a855f7) — the Olas brand primary.
const LEVEL_COLORS = [
  '#ebedf0',
  'rgba(168, 85, 247, 0.3)',
  'rgba(168, 85, 247, 0.5)',
  'rgba(168, 85, 247, 0.75)',
  'rgba(168, 85, 247, 1)',
];

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']; // rows 0–6 (Sun–Sat)

type Cell = { date: string; count: number; inRange: boolean };

const getLevel = (count: number, max: number): number => {
  if (count <= 0) return 0;
  if (max <= 0) return 1;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
};

/**
 * Build a GitHub-style calendar: an array of week columns, each holding 7 cells
 * (Sun→Sat). The grid is padded to whole weeks, so cells outside the data range
 * are marked `inRange: false` and rendered transparent.
 */
const buildWeeks = (series: DaaSeriesPoint[]): { weeks: Cell[][]; max: number } => {
  if (series.length === 0) return { weeks: [], max: 0 };

  const countByDate = new Map(series.map((point) => [point.date, point.count]));
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0].date;
  const lastDate = sorted[sorted.length - 1].date;

  // Pad to full weeks: back to the Sunday on/before the first day, forward to
  // the Saturday on/after the last day.
  const gridStart = dayjs(firstDate).day(0);
  const gridEnd = dayjs(lastDate).day(6);
  const totalDays = gridEnd.diff(gridStart, 'day') + 1;

  let max = 0;
  const cells: Cell[] = [];
  for (let i = 0; i < totalDays; i += 1) {
    const date = gridStart.add(i, 'day').format('YYYY-MM-DD');
    const inRange = date >= firstDate && date <= lastDate;
    const count = inRange ? (countByDate.get(date) ?? 0) : 0;
    if (count > max) max = count;
    cells.push({ date, count, inRange });
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return { weeks, max };
};

type DaaActivityHeatmapProps = {
  series: DaaSeriesPoint[];
  title?: string;
  className?: string;
  id?: string;
};

export const DaaActivityHeatmap = ({
  series,
  title = 'Daily Active Agents',
  className,
  id,
}: DaaActivityHeatmapProps) => {
  const { weeks, max } = useMemo(() => buildWeeks(series), [series]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Land on the most recent week (right edge), like GitHub.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  return (
    <div id={id} className={`w-full overflow-hidden ${className ?? ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      {weeks.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          Data not yet available
        </div>
      ) : (
        <>
          <div className="flex">
            {/* Weekday labels — fixed, outside the fading scroll area */}
            <div
              className="flex flex-col flex-shrink-0 text-xs text-gray-500"
              style={{ gap: CELL_GAP, width: WEEKDAY_LABEL_WIDTH }}
            >
              <div style={{ height: MONTH_ROW_HEIGHT }} />
              {WEEKDAY_LABELS.map((label, row) => (
                <div
                  key={row}
                  className="flex items-center"
                  style={{ height: CELL_SIZE, lineHeight: `${CELL_SIZE}px` }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Scrollable, edge-faded calendar */}
            <div
              ref={scrollRef}
              className="overflow-x-auto"
              style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
            >
              <div className="inline-flex flex-col" style={{ gap: CELL_GAP, padding: '0 40px' }}>
                {/* Month labels, aligned to the week columns */}
                <div className="flex text-xs text-gray-500" style={{ gap: CELL_GAP }}>
                  {weeks.map((week, weekIndex) => {
                    const monthStart = dayjs(week[0].date);
                    const prevMonth =
                      weekIndex > 0 ? dayjs(weeks[weekIndex - 1][0].date).month() : -1;
                    const showLabel = monthStart.month() !== prevMonth;
                    return (
                      <div
                        key={week[0].date}
                        className="relative"
                        style={{ width: CELL_SIZE, height: MONTH_ROW_HEIGHT }}
                      >
                        {showLabel && (
                          <span className="absolute left-0 top-0 whitespace-nowrap">
                            {monthStart.format('MMM')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Day grid */}
                <div className="flex" style={{ gap: CELL_GAP }}>
                  {weeks.map((week) => (
                    <div key={week[0].date} className="flex flex-col" style={{ gap: CELL_GAP }}>
                      {week.map((cell) => (
                        <div
                          key={cell.date}
                          title={
                            cell.inRange
                              ? `${dayjs(cell.date).format('ddd, DD MMM YYYY')}: ${cell.count} active agents`
                              : undefined
                          }
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: 2,
                            backgroundColor: cell.inRange
                              ? LEVEL_COLORS[getLevel(cell.count, max)]
                              : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500 mt-4">
            <span>Less</span>
            {LEVEL_COLORS.map((color) => (
              <span
                key={color}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </>
      )}
    </div>
  );
};
