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
  lastValidAt: number | null; // Timestamp when data was last valid
  indexingErrors: string[]; // Subgraphs with hasIndexingErrors: true
  fetchErrors: string[]; // Subgraphs where fetch was rejected
};

export type MetricWithStatus<T> = {
  value: T;
  status: MetricStatus;
};

export const isMetricWithStatus = (
  data: unknown,
): data is MetricWithStatus<unknown> =>
  typeof data === 'object' &&
  data !== null &&
  'value' in data &&
  'status' in data;
