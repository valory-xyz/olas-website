import get from 'lodash/get';

/**
 * Safely extract a number from a PromiseSettledResult with a nested path.
 * Returns 0 if the promise was rejected or the value is missing.
 */
export const extractSettledNumber = (res, key) => {
  if (res.status !== 'fulfilled') return 0;
  return Number(get(res.value, key) ?? 0);
};
