import { MetricStatus } from './types';

export const createStaleStatus = (
  indexingErrors: string[],
  fetchErrors: string[],
): MetricStatus => ({
  stale: indexingErrors.length > 0 || fetchErrors.length > 0,
  lastValidAt: Date.now(),
  indexingErrors,
  fetchErrors,
});
