type MetricStatus = {
  stale: boolean;
  lastValidAt: number | null;
  indexingErrors: string[];
  fetchErrors: string[];
};

export type StaleIndicatorProps = {
  status: MetricStatus | undefined;
};
