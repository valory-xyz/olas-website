import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { dailyAgentsFunPerformancesQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

type DailyAgentPerformance = {
  dailyAgentPerformances: {
    activeMultisigCount: number;
  }[];
};

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  const result: DailyAgentPerformance =
    await REGISTRY_GRAPH_CLIENTS.base.request(dailyAgentsFunPerformancesQuery, {
      timestamp_gt,
      timestamp_lt,
    });

  const performances = result.dailyAgentPerformances ?? [];
  return calculate7DayAverage(performances, 'activeMultisigCount');
};

export const fetchAgentsFunMetrics = async () => {
  try {
    const dailyActiveAgents = await fetchDailyAgentPerformance();
    return { dailyActiveAgents };
  } catch (error) {
    console.error('Error fetching agents.fun metrics:', error);
    return null;
  }
};
