import { autonolasGraphClient } from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
  getFetchErrorAndCreateStaleStatus,
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
    transform: (data) => Number(data.global?.totalBuilders || 0),
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
