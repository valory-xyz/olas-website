/** @returns the timestamp for 00:00 UTC N days ago */
export const getMidnightUtcTimestampDaysAgo = (daysAgo) => {
  const now = new Date();
  const utcMidnightToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const timestamp = Math.floor((utcMidnightToday - daysAgo * 24 * 60 * 60 * 1000) / 1000);
  return timestamp;
};
