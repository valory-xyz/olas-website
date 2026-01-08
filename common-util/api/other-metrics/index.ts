import { MetricWithStatus } from 'common-util/graphql/types';
import { fetchBuildMetrics } from './build';
import { fetchContributeMetrics } from './contribute';
import { fetchGovernMetrics } from './govern';
import { fetchProtocolMetrics } from './protocol';
import { fetchTokenHolders } from './token-holders';

export type OtherMetricsData = {
  build: {
    totalBuilders: MetricWithStatus<number | null>;
  };
  contribute: {
    totalOlasContributors: MetricWithStatus<number | null>;
    dailyActiveContributors: MetricWithStatus<number | null>;
  };
  govern: {
    lockedOlas: MetricWithStatus<number | null>;
    activeHolders: MetricWithStatus<number | null>;
  };
  tokenHolders: {
    totalTokenHolders: MetricWithStatus<number | null>;
  };
  protocol: {
    totalProtocolOwnedLiquidity: MetricWithStatus<number | null>;
    totalProtocolRevenue: MetricWithStatus<number | null>;
  };
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
