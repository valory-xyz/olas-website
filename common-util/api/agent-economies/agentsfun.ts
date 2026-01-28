import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { executeGraphQLQuery } from 'common-util/graphql/metric-utils';
import { dailyAgentsFunPerformancesQuery } from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformance = WithMeta<{
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
}>;

export const fetchAgentsFunMetrics = async () => {
  const dailyActiveAgents = await executeGraphQLQuery<DailyAgentPerformance, number>({
    client: REGISTRY_GRAPH_CLIENTS.base,
    chain: 'base',
    query: dailyAgentsFunPerformancesQuery,
    variables: {
      timestamp_gt: getMidnightUtcTimestampDaysAgo(8),
      timestamp_lt: getMidnightUtcTimestampDaysAgo(0),
    },
    source: 'registry:base',
    transform: (data) => {
      const performances = data.dailyAgentPerformances ?? [];
      return calculate7DayAverage(performances, 'activeMultisigCount');
    },
  });

  return { dailyActiveAgents };
};
