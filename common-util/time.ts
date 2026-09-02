const UTC_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Formats a millisecond timestamp as `13 August 2026 14:00 UTC`, for the
 * machine-readable "as of" clause on published metrics.
 *
 * Built from `getUTC*` accessors rather than `toLocaleString` on purpose: these
 * components render on both the server and the client, and any locale- or
 * timezone-dependent string produces a hydration mismatch.
 *
 * @returns the formatted string, or null when there is no timestamp to show —
 * callers must omit the clause rather than substitute the current time.
 */
export const formatUtcAsOf = (ms?: number | null): string | null => {
  if (typeof ms !== 'number' || !Number.isFinite(ms)) return null;

  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;

  const day = date.getUTCDate();
  const month = UTC_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes} UTC`;
};

/** Date-only form of {@link formatUtcAsOf}, e.g. `15 June 2026`. */
export const formatUtcDate = (ms?: number | null): string | null => {
  const full = formatUtcAsOf(ms);
  return full === null ? null : full.replace(/ \d{2}:\d{2} UTC$/, '');
};

/** @returns the timestamp for 00:00 UTC N days ago */
export const getMidnightUtcTimestampDaysAgo = (daysAgo) => {
  const now = new Date();
  const utcMidnightToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const timestamp = Math.floor((utcMidnightToday - daysAgo * 24 * 60 * 60 * 1000) / 1000);
  return timestamp;
};
