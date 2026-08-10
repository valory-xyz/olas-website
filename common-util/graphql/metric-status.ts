/**
 * Pure status/merge decisions for `MetricWithStatus`, kept free of runtime imports so the
 * unit tests can load this file directly under `node --test` (type-stripping only — no
 * path aliases, no viem, no lodash). Everything here decides what number the public
 * dashboard publishes, which is why it is tested rather than only reasoned about.
 *
 * Re-exported from metric-utils.ts; import from there in app code.
 */
import type { MetricStatus, MetricWithStatus } from './types';

const isNil = (v: unknown): boolean => v === null || v === undefined;

/**
 * A source failed outright, as opposed to merely running behind. Only this forces a
 * fallback to the previous value — lag still publishes live data. Single definition so the
 * merge, the tooltip and the grey-out cannot drift apart.
 */
export const hasHardError = (
  status?: Pick<MetricStatus, 'fetchErrors' | 'indexingErrors'> | null
): boolean => (status?.fetchErrors?.length ?? 0) > 0 || (status?.indexingErrors?.length ?? 0) > 0;

/**
 * Whether the displayed value is a held-over fallback (grey it out) rather than live data.
 * Falls back to deriving from the error arrays so snapshots written before `frozen` existed
 * still render correctly.
 */
export const isFrozen = (status?: MetricStatus | null): boolean =>
  status?.frozen ?? hasHardError(status);

/**
 * Reads a field off a subgraph's singleton `global` entity.
 *
 * A subgraph can answer successfully with `global: null` (e.g. mid-reindex). Coercing that
 * to 0 would drop the chain from a cross-chain sum yet still publish `stale: false`,
 * overwriting the blob with a too-low number. Record a fetch error instead, so the metric
 * freezes and the merge keeps the last good value. `K extends keyof TGlobal` makes the
 * return type follow the field rather than a caller-supplied assertion.
 */
export const readGlobalField = <TGlobal, K extends keyof TGlobal>(
  globalEntity: TGlobal | null | undefined,
  field: K,
  source: string,
  fetchErrors: string[]
): TGlobal[K] | null => {
  const value = globalEntity?.[field];
  if (isNil(value)) {
    console.error(`${source}: subgraph responded without global.${String(field)}`);
    fetchErrors.push(`${source}:missingGlobal`);
    return null;
  }
  return value as TGlobal[K];
};

/**
 * Decides what a single metric publishes this run.
 *
 * Only a hard failure (or a nil value) makes the new reading untrustworthy. A lagging
 * subgraph still returns real data for its chain — just a little behind — so the fresh
 * aggregate is closer to the truth than a frozen one that ages indefinitely. `stale` stays
 * as computed (lag included) to drive the indicator; `frozen` records whether the published
 * value is actually a held-over one, which is what greys the number out.
 */
export const resolveMergedMetric = (
  newMetric: MetricWithStatus<unknown>,
  oldMetric: MetricWithStatus<unknown> | null,
  now: number
): MetricWithStatus<unknown> => {
  if (isNil(newMetric.value) || hasHardError(newMetric.status)) {
    if (oldMetric && !isNil(oldMetric.value)) {
      return {
        value: oldMetric.value,
        status: {
          ...newMetric.status,
          stale: true,
          frozen: true,
          lastValidAt: oldMetric.status?.lastValidAt ?? null,
        },
      };
    }
    return {
      ...newMetric,
      status: {
        ...newMetric.status,
        stale: true,
        frozen: true,
        lastValidAt: newMetric.status?.lastValidAt ?? null,
      },
    };
  }

  return {
    ...newMetric,
    status: { ...newMetric.status, frozen: false, lastValidAt: now },
  };
};
