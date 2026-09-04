import { buildMetricContext, type MetricContextProps } from 'common-util/metric-context';

export { buildMetricContext, formatFullNumber } from 'common-util/metric-context';
export type { MetricContextProps } from 'common-util/metric-context';

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
