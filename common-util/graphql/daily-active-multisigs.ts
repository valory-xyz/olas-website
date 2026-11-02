/**
 * Pure helpers behind the squid twin of the daily active multisigs query, kept free of
 * runtime imports so `node --test` can load this file directly. Run with
 * `yarn daily-active-multisigs:test`.
 *
 * The squid's `dailyActiveMultisigs` list is the per-Safe join rows, so the per-day totals
 * are read by id, one `day_<ts>` alias per UTC day, and folded back into the subgraph's
 * `dailyActiveMultisigs_collection` shape.
 */
import type { WithMeta } from './types';

export const DAILY_ACTIVE_MULTISIGS_ALIAS_PREFIX = 'day_';

const DAY_SECONDS = 86400;

export type DailyAgentPerformancesResult = WithMeta<{
  dailyActiveMultisigs_collection: {
    id: string;
    count: number;
  }[];
}>;

// Midnight UTC of every day strictly inside (timestamp_gt, timestamp_lt), newest first.
export const dailyActiveMultisigsDays = (timestamp_gt: number, timestamp_lt: number) => {
  const days: number[] = [];
  for (let day = timestamp_lt - DAY_SECONDS; day > timestamp_gt; day -= DAY_SECONDS) {
    days.push(day);
  }
  return days;
};

// Squid responses carry one `day_<ts>` alias per day (null when the day has no row); fold
// them, newest first, into the subgraph shape. Subgraph responses pass through untouched.
export const toDailyActiveMultisigsCollection = (
  data: Record<string, unknown>
): DailyAgentPerformancesResult => {
  if ('dailyActiveMultisigs_collection' in data) return data as DailyAgentPerformancesResult;
  const dayKeys = Object.keys(data)
    .filter((key) => key.startsWith(DAILY_ACTIVE_MULTISIGS_ALIAS_PREFIX))
    .sort()
    .reverse();
  if (dayKeys.length === 0) return data as DailyAgentPerformancesResult;
  return {
    _meta: data._meta as DailyAgentPerformancesResult['_meta'],
    dailyActiveMultisigs_collection: dayKeys
      .map((key) => data[key] as { id: string; count: number } | null)
      .filter((row) => row != null),
  };
};
