import dayjs from 'dayjs';

/** A single day of Daily Active Agents, keyed by its UTC date (YYYY-MM-DD). */
export type DaaSeriesPoint = { date: string; count: number };

/**
 * TODO(explorer): replace with the real Omenstrat DAA daily series once the data
 * source is wired up. Placeholder only — lets us iterate on the heatmap design
 * without hitting the subgraph.
 *
 * Deterministic pseudo-random (seeded by day offset) so builds stay stable;
 * weekends dip a little to mimic real activity.
 */
export const generateMockDaaSeries = (days: number): DaaSeriesPoint[] => {
  const today = dayjs().startOf('day');
  const series: DaaSeriesPoint[] = [];
  for (let i = days; i >= 1; i -= 1) {
    const day = today.subtract(i, 'day');
    const seeded = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const weekendFactor = day.day() === 0 || day.day() === 6 ? 0.5 : 1;
    series.push({ date: day.format('YYYY-MM-DD'), count: Math.round(seeded * 14 * weekendFactor) });
  }
  return series;
};
