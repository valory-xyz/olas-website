import { fetchBuildMetrics } from './build';
import { fetchContributeMetrics } from './contribute';
import { fetchGovernMetrics } from './govern';
import { fetchTokenHolders } from './token-holders';

export const fetchAllOtherMetrics = async () => {
  const [build, contribute, govern, tokenHolders] = await Promise.all([
    fetchBuildMetrics(),
    fetchContributeMetrics(),
    fetchGovernMetrics(),
    fetchTokenHolders(),
  ]);

  return {
    data: {
      build,
      contribute,
      govern,
      tokenHolders,
    },
    timestamp: Date.now(),
  };
};
