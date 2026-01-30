type MetricStatus = {
  stale: boolean;
  lastValidAt: number | null;
  indexingErrors: string[];
  fetchErrors: string[];
  laggingSubgraphs: string[];
};

export type StaleIndicatorProps = {
  status: MetricStatus | undefined;
};
