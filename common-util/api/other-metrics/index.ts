import { fetchBuildMetrics } from './build';
import { fetchContributeMetrics } from './contribute';
import { fetchGovernMetrics } from './govern';
import { fetchProtocolMetrics } from './protocol';
import { fetchTokenHolders } from './token-holders';

export type OtherMetricsData = {
  build: Awaited<ReturnType<typeof fetchBuildMetrics>>;
  contribute: Awaited<ReturnType<typeof fetchContributeMetrics>>;
  govern: Awaited<ReturnType<typeof fetchGovernMetrics>>;
  tokenHolders: Awaited<ReturnType<typeof fetchTokenHolders>>;
  protocol: Awaited<ReturnType<typeof fetchProtocolMetrics>>;
};

export type OtherMetricsSnapshot = {
  data: OtherMetricsData;
  timestamp: number;
};

export const fetchAllOtherMetrics = async (): Promise<OtherMetricsSnapshot> => {
  const [build, contribute, govern, tokenHolders, protocol] = await Promise.all(
    [
      fetchBuildMetrics(),
      fetchContributeMetrics(),
      fetchGovernMetrics(),
      fetchTokenHolders(),
      fetchProtocolMetrics(),
    ]
  );

  return {
    data: {
      build,
      contribute,
      govern,
      tokenHolders,
      protocol,
    },
    timestamp: Date.now(),
  };
};
