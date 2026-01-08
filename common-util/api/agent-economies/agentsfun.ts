import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { dailyAgentsFunPerformancesQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformance = WithMeta<{
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
}>;

const fetchDailyAgentPerformance = async (): Promise<
  MetricWithStatus<number | null>
> => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const result: DailyAgentPerformance = (await REGISTRY_GRAPH_CLIENTS.base.request(
      dailyAgentsFunPerformancesQuery,
      {
        timestamp_gt,
        timestamp_lt,
      }
    ));

    if (result._meta?.hasIndexingErrors) {
      indexingErrors.push('registry:base');
    }

    const performances = result.dailyAgentPerformances ?? [];
    const average = calculate7DayAverage(performances, 'activeMultisigCount');

    return {
      value: average,
      status: createStaleStatus(indexingErrors, fetchErrors),
    };
  } catch (error) {
    console.error('Error fetching agents.fun daily agent performances:', error);
    return {
      value: null,
      status: createStaleStatus([], ['registry:base']),
    };
  }
};

export const fetchAgentsFunMetrics = async () => {
  try {
    const dailyActiveAgents = await fetchDailyAgentPerformance();
    return { dailyActiveAgents };
  } catch (error) {
    console.error('Error fetching agents.fun metrics:', error);
    return {
      dailyActiveAgents: {
        value: null,
        status: createStaleStatus([], ['registry:base']),
      },
    };
  }
};
