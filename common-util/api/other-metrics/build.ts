import { autonolasGraphClient } from 'common-util/graphql/client';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { totalBuildersQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';

type TotalBuildersResult = WithMeta<{
  globals: { totalBuilders: number }[];
}>;

const fetchTotalBuilders = async (): Promise<
  MetricWithStatus<number | null>
> => {
  try {
    const result: TotalBuildersResult =
      await autonolasGraphClient.request(totalBuildersQuery);

    const indexingErrors: string[] = [];
    if (result._meta?.hasIndexingErrors) {
      indexingErrors.push('build:totalBuilders');
    }

    const globals = result?.globals || [];
    if (globals.length === 0) {
      return {
        value: null,
        status: createStaleStatus(indexingErrors, ['build:totalBuilders']),
      };
    }

    // TODO: Update totalBuildersQuery to use global(id: '') instead of globals array
    // to avoid needing to pick the first item
    return {
      value: Number(globals[0]?.totalBuilders || 0),
      status: createStaleStatus(indexingErrors, []),
    };
  } catch (error) {
    console.error('Error fetching total builders:', error);
    return {
      value: null,
      status: createStaleStatus([], ['build:totalBuilders']),
    };
  }
};

export const fetchBuildMetrics = async () => {
  try {
    const [totalBuildersResult] = await Promise.allSettled([
      fetchTotalBuilders(),
    ]);

    let totalBuilders: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus([], []),
    };

    if (totalBuildersResult.status === 'fulfilled') {
      totalBuilders = totalBuildersResult.value;
    } else {
      console.error('Fetch Total Builders failed:', totalBuildersResult.reason);
      totalBuilders.status = createStaleStatus([], ['build:totalBuilders']);
    }

    return { totalBuilders };
  } catch (error) {
    console.error('Error fetching build metrics:', error);
    return {
      totalBuilders: {
        value: null,
        status: createStaleStatus([], ['build:all']),
      },
    };
  }
};
