import { fetchBuildMetrics } from './build';
import { fetchContributeMetrics } from './contribute';
import { fetchGovernMetrics } from './govern';
import { fetchProtocolMetrics } from './protocol';
import { fetchOlasTotalSupplyWei } from './token-supply';
import { fetchTokenHolders } from './token-holders';
import { fetchTokenomicsMetrics } from './tokenomics';

export type OtherMetricsData = {
  build: Awaited<ReturnType<typeof fetchBuildMetrics>>;
  contribute: Awaited<ReturnType<typeof fetchContributeMetrics>>;
  govern: Awaited<ReturnType<typeof fetchGovernMetrics>>;
  tokenHolders: Awaited<ReturnType<typeof fetchTokenHolders>>;
  protocol: Awaited<ReturnType<typeof fetchProtocolMetrics>>;
  olasTotalSupplyWei: Awaited<ReturnType<typeof fetchOlasTotalSupplyWei>>;
  tokenomics: Awaited<ReturnType<typeof fetchTokenomicsMetrics>>;
};

export type OtherMetricsSnapshot = {
  data: OtherMetricsData;
  timestamp: number;
};

export const fetchAllOtherMetrics = async (): Promise<OtherMetricsSnapshot> => {
  const [build, contribute, govern, tokenHolders, protocol, olasTotalSupplyWei, tokenomics] =
    await Promise.all([
      fetchBuildMetrics(),
      fetchContributeMetrics(),
      fetchGovernMetrics(),
      fetchTokenHolders(),
      fetchProtocolMetrics(),
      fetchOlasTotalSupplyWei(),
      fetchTokenomicsMetrics(),
    ]);

  return {
    data: {
      build,
      contribute,
      govern,
      tokenHolders,
      protocol,
      olasTotalSupplyWei,
      tokenomics,
    },
    timestamp: Date.now(),
  };
};
