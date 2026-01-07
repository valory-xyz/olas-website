import { fetchBuildMetrics } from './build';
import { fetchContributeMetrics } from './contribute';
import { fetchGovernMetrics } from './govern';
import { fetchProtocolMetrics } from './protocol';
import { fetchTokenHolders } from './token-holders';

export const fetchAllOtherMetrics = async () => {
  const [build, contribute, govern, tokenHolders, protocol] = await Promise.all(
    [
      fetchBuildMetrics(),
      fetchContributeMetrics(),
      fetchGovernMetrics(),
      fetchTokenHolders(),
      fetchProtocolMetrics(),
    ],
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
