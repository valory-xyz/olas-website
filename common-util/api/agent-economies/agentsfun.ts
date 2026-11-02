import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { requestRegistry } from 'common-util/graphql/indexer-requests';
import { executeGraphQLQuery } from 'common-util/graphql/metric-utils';
import {
  dailyAgentsFunPerformancesQuery,
  dailyAgentsFunPerformancesSquidQuery,
} from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformance = WithMeta<{
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
}>;

export const fetchAgentsFunMetrics = async () => {
  const dailyActiveAgents = await executeGraphQLQuery<DailyAgentPerformance, number>({
    request: () =>
      requestRegistry<DailyAgentPerformance>(
        'base',
        { subgraph: dailyAgentsFunPerformancesQuery, squid: dailyAgentsFunPerformancesSquidQuery },
        {
          timestamp_gt: getMidnightUtcTimestampDaysAgo(8),
          timestamp_lt: getMidnightUtcTimestampDaysAgo(0),
        }
      ),
    chain: 'base',
    source: 'registry:base',
    transform: (data) => {
      const performances = data.dailyAgentPerformances ?? [];
      return calculate7DayAverage(performances, 'activeMultisigCount');
    },
  });

  return { dailyActiveAgents };
};
