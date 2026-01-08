import { autonolasGraphClient } from 'common-util/graphql/client';
import { totalBuildersQuery } from 'common-util/graphql/queries';

type TotalBuildersResult = {
  globals: { totalBuilders: number }[];
};

const fetchTotalBuilders = async () => {
  try {
    const result: TotalBuildersResult =
      await autonolasGraphClient.request(totalBuildersQuery);
    const globals = result?.globals || [];
    if (globals.length === 0) {
      return null;
    }
    // TODO: Update totalBuildersQuery to use global(id: '') instead of globals array
    // to avoid needing to pick the first item
    return Number(globals[0]?.totalBuilders || 0);
  } catch (error) {
    console.error('Error fetching total builders:', error);
    return null;
  }
};

export const fetchBuildMetrics = async () => {
  try {
    const [totalBuildersResult] = await Promise.allSettled([
      fetchTotalBuilders(),
    ]);

    const metrics: { totalBuilders: number | null } = {
      totalBuilders: null,
    };

    if (totalBuildersResult.status === 'fulfilled') {
      metrics.totalBuilders = totalBuildersResult.value;
    } else {
      console.error('Fetch Total Builders failed:', totalBuildersResult.reason);
    }

    return metrics;
  } catch (error) {
    console.error('Error fetching build metrics:', error);
    return null;
  }
};
