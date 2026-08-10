import { MetricStatus } from 'common-util/graphql/types';

// Re-exported from the canonical definition rather than redeclared: a local duplicate
// silently dropped `frozen`, so this component could not see the field at all and its
// tooltip contradicted the grey-out it sits next to.
export type { MetricStatus };

export type StaleIndicatorProps = {
  status: MetricStatus | undefined;
};
