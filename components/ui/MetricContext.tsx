import { isFrozen } from 'common-util/graphql/metric-utils';
import { MetricStatus } from 'common-util/graphql/types';
import { formatUtcAsOf } from 'common-util/time';

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
  const asOf = formatUtcAsOf(status?.lastValidAt ?? asOfFallback);

  const parts = [`${readableValue} ${noun}`];
  if (scope) parts.push(scope);
  if (window) parts.push(window);
  if (asOf) parts.push(`as of ${asOf}`);

  const sentence = `${parts.join(', ')}.`;

  // A frozen value is a held-over fallback, not this run's data. Say so rather than
  // presenting a stale number as current.
  return isFrozen(status)
    ? `${sentence} This is the last confirmed value; the live source is currently unavailable.`
    : sentence;
};

/**
 * Renders nothing visible. Emits a screen-reader-only sentence giving a published
 * number its scope, window and as-of date, so the value is unambiguous in the text
 * layer that crawlers and assistive technology read.
 *
 * The visible tile is untouched — see `TokenomicsSummaryTable` for the same pattern
 * applied to charts.
 */
export const MetricContext = (props: MetricContextProps) => {
  const sentence = buildMetricContext(props);
  if (!sentence) return null;

  // Leading space via an expression (JSX would trim a literal one): without a boundary
  // the extracted text glues onto whatever precedes it — "Operators3,704 unique…".
  return <span className="sr-only">{` ${sentence}`}</span>;
};
