export type SubgraphMeta = {
  hasIndexingErrors: boolean;
  block: {
    number: number;
  };
};

export type WithMeta<T> = T & {
  _meta?: SubgraphMeta;
};

export type MetricStatus = {
  /**
   * Something is wrong with at least one source — drives the amber indicator.
   * Broader than `frozen`: a lagging subgraph is stale but still publishes live data.
   */
  stale: boolean;
  /**
   * The published value is a held-over fallback rather than this run's data, because a
   * source hard-failed or returned nothing. Drives the greyed-out value text. Optional so
   * snapshots written before this field existed still deserialize — read it through
   * `isFrozen()` in metric-utils, which derives it from the error arrays when absent.
   */
  frozen?: boolean;
  /**
   * Timestamp when data was last valid
   */
  lastValidAt: number | null;
  /**
   * Subgraphs with hasIndexingErrors: true
   */
  indexingErrors: string[];
  /**
   * Subgraphs where fetch was rejected
   */
  fetchErrors: string[];
  /**
   * Subgraphs that are lagging behind the chain by a specified number of blocks
   */
  laggingSubgraphs: string[];
};

export type MetricWithStatus<T> = {
  value: T;
  status: MetricStatus;
};

export const isMetricWithStatus = (data: unknown): data is MetricWithStatus<unknown> =>
  typeof data === 'object' && data !== null && 'value' in data && 'status' in data;
