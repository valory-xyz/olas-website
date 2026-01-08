import { MetricStatus } from './types';

export const createStaleStatus = (
  indexingErrors: string[],
  fetchErrors: string[],
): MetricStatus => ({
  stale: indexingErrors.length > 0 || fetchErrors.length > 0,
  lastValidAt:
    indexingErrors.length === 0 && fetchErrors.length === 0 ? Date.now() : null,
  indexingErrors,
  fetchErrors,
});
