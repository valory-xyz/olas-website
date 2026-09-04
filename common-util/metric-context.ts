/**
 * Pure helpers behind `components/ui/MetricContext.tsx`.
 *
 * Kept free of JSX so Node's type-stripping can load this module directly in tests,
 * the same split `metric-status.ts` uses. Every sentence published to the text layer
 * is composed here, so the cases below are the contract worth asserting.
 */
// Relative, extension-bearing specifiers so Node's type-stripping test runner can load
// this module directly (it uses ESM resolution, which has no notion of the tsconfig
// aliases). `metric-status.ts` already imports its sibling the same way. `isFrozen`
// comes from `metric-status` rather than `metric-utils` because the latter pulls in the
// GraphQL clients, which a unit test has no business booting.
import { isFrozen } from './graphql/metric-status.ts';
import type { MetricStatus } from './graphql/types.ts';
import { formatUtcAsOf } from './time.ts';

/**
 * Full, unabbreviated numbers. A visible tile may read "4.2M"; the machine-readable
 * text must read "4,254,952", because compact notation is ambiguous as prose.
 */
const FULL_NUMBER: Intl.NumberFormatOptions = {
  notation: 'standard',
  maximumFractionDigits: 2,
};

/**
 * Formats a raw metric value for the context sentence.
 *
 * Accepts strings as well as numbers because snapshots mix the two, and some callers
 * pass values that have already been through `toLocaleString`. Anything that resolves
 * to a number is reformatted here so separators, currency and units are applied
 * consistently — otherwise a string value would slip through as a bare `14523741`.
 */
export const formatFullNumber = (
  value: number | string,
  { isMoney = false, unit = '' }: { isMoney?: boolean; unit?: string } = {}
): string | null => {
  const num = toNumber(value);
  if (num === null) return null;
  // Pad cents only when there is a fractional part, so $645.3 reads $645.30 while a
  // whole-dollar figure stays clean.
  const formatted = num.toLocaleString('en-US', {
    ...FULL_NUMBER,
    ...(isMoney && !Number.isInteger(num) ? { minimumFractionDigits: 2 } : {}),
  });
  return `${isMoney ? '$' : ''}${formatted}${unit ? ` ${unit}` : ''}`;
};

/** Parses a number, tolerating currency symbols and grouping separators. */
const toNumber = (value: number | string): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[$,\s]/g, '');
  if (cleaned === '' || !/^-?\d*\.?\d+$/.test(cleaned)) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
};

export type MetricContextProps = {
  /**
   * The value as it should be read aloud. Pass a number and it is formatted in full;
   * pass a string only when it is already unabbreviated (e.g. "$107,791.05").
   */
  value: number | string | null | undefined;
  /** What the number counts, e.g. "total transactions by all Olas agents". */
  noun: string;
  /**
   * The label shown on screen beside this value, echoed into the sentence.
   *
   * Ties the hidden text to the visible one: when a label is renamed the sentence
   * follows automatically, instead of going stale silently. "Trading ROI", windowed
   * APR and the chain list all drifted that way while this work was in review.
   */
  label?: string;
  /** Coverage, e.g. "across all supported chains". Lift the wording from /data. */
  scope?: string;
  /** Time window, e.g. "all time", "7-day average", "over the last 7 days". */
  window?: string;
  /** Drives the as-of date, and notes when the value is a held-over one. */
  status?: MetricStatus;
  /** Used when `status.lastValidAt` is null — a lagging source still publishes live data. */
  asOfFallback?: number | null;
  /** Set when `value` is a bare number that represents money. */
  isMoney?: boolean;
  /** Appended after the number, e.g. "OLAS". */
  unit?: string;
};

/**
 * Composes the one-sentence machine-readable description of a metric.
 *
 * Exported separately from the component so it can be used as an `aria-label`
 * or title where a sibling element is not possible.
 */
export const buildMetricContext = ({
  value,
  noun,
  label,
  scope,
  window,
  status,
  asOfFallback,
  isMoney,
  unit,
}: MetricContextProps): string | null => {
  if (value === null || value === undefined || value === '') return null;

  // Reformat anything numeric, whatever type it arrived as; fall back to the raw
  // string only for genuinely non-numeric values (e.g. an already-suffixed "69%").
  const readableValue = formatFullNumber(value, { isMoney, unit }) ?? String(value);
  // A placeholder like "--" is not a published number; emitting a sentence for it
  // would assert something the page does not actually say.
  if (!readableValue || !/\d/.test(readableValue)) return null;

  // `lastValidAt` is null while a source merely lags, so fall back to the snapshot's
  // own timestamp. If neither exists we omit the clause — never invent a time.
  // Distinguish where the timestamp came from: `lastValidAt` genuinely dates the value,
  // while the snapshot fallback only dates the run that failed to refresh it.
  const hasOwnTimestamp = typeof status?.lastValidAt === 'number';
  const asOf = formatUtcAsOf(status?.lastValidAt ?? asOfFallback);

  // The label is quoted so a reader can match the sentence to what is on screen, and
  // so a test can assert the two agree.
  const parts = [`${readableValue} ${noun}${label ? ` (shown as "${label}")` : ''}`];
  if (scope) parts.push(scope);
  if (window) parts.push(window);
  if (asOf) parts.push(`as of ${asOf}`);

  const sentence = `${parts.join(', ')}.`;

  // Three distinct states, which `isFrozen` alone conflates:
  //   frozen with a lastValidAt   → a genuinely held-over, previously confirmed value
  //   frozen without one          → no usable prior value; the reading is incomplete and
  //                                 the timestamp only dates the run that failed
  //   lagging but live            → this run's data, but a lagging source may undercount
  if (isFrozen(status)) {
    return hasOwnTimestamp
      ? `${sentence} This is the last confirmed value; the live source is currently unavailable.`
      : `${sentence} This reading is incomplete — a source was unavailable and no earlier confirmed value exists, so the date above is when the failed refresh ran, not when the value was last valid.`;
  }

  if (status?.laggingSubgraphs?.length) {
    return `${sentence} One or more sources are behind the chain, so this figure may undercount.`;
  }

  return sentence;
};
