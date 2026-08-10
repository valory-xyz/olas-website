import { autonolasGraphClient } from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
  getFetchErrorAndCreateStaleStatus,
  readGlobalField,
} from 'common-util/graphql/metric-utils';
import { totalBuildersQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';

type TotalBuildersResult = WithMeta<{
  global: { totalBuilders: number };
}>;

const fetchTotalBuilders = async (): Promise<MetricWithStatus<number | null>> => {
  return executeGraphQLQuery<TotalBuildersResult, number | null>({
    client: autonolasGraphClient,
    chain: 'ethereum',
    query: totalBuildersQuery,
    source: 'build:totalBuilders',
    // null (not 0) on an absent entity, so the merge holds the last good value instead of
    // publishing a zero as healthy — and readGlobalField names the source in the tooltip.
    transform: (data, fetchErrors) => {
      const total = readGlobalField(
        data.global,
        'totalBuilders',
        'build:totalBuilders',
        fetchErrors
      );
      return total === null ? null : Number(total);
    },
  });
};

export const fetchBuildMetrics = async () => {
  try {
    const [totalBuildersResult] = await Promise.allSettled([fetchTotalBuilders()]);

    let totalBuilders: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };

    if (totalBuildersResult.status === 'fulfilled') {
      totalBuilders = totalBuildersResult.value;
    } else {
      console.error('Fetch Total Builders failed:', totalBuildersResult.reason);
      totalBuilders.status = getFetchErrorAndCreateStaleStatus('build:totalBuilders');
    }

    return { totalBuilders };
  } catch (error) {
    console.error('Error fetching build metrics:', error);
    return {
      totalBuilders: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('build:all'),
      },
    };
  }
};
