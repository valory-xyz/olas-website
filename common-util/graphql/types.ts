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
  stale: boolean;
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
