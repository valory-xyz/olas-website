import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { autonolasBaseGraphClient } from 'common-util/graphql/client';
import {
  createStaleStatus,
  executeGraphQLQuery,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { dailyActivitiesQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const AGENT_TYPE = 14;
const ATTRIBUTE_TYPE_ID = 8;
const LIMIT = 1000;
const LEADERBOARD_BASE_URL = `${process.env.NEXT_PUBLIC_AFMDB_URL}/api/agent-types/${AGENT_TYPE}/attributes/${ATTRIBUTE_TYPE_ID}/values`;
const LEADERBOARD_ERROR_MESSAGE = 'Failed to fetch leaderboard.';

type DailyActivitiesResult = WithMeta<{
  dailyActivities: { count: number }[];
}>;

const fetchContributeDaa7dAvg = async (): Promise<MetricWithStatus<number | null>> => {
  return executeGraphQLQuery<DailyActivitiesResult, number>({
    client: autonolasBaseGraphClient,
    chain: 'base',
    query: dailyActivitiesQuery,
    variables: {
      where: {
        dayTimestamp_gt: String(getMidnightUtcTimestampDaysAgo(8)),
        dayTimestamp_lt: String(getMidnightUtcTimestampDaysAgo(0)),
      },
      orderBy: 'dayTimestamp',
      orderDirection: 'desc',
    },
    source: 'contribute:daa',
    transform: (data) => {
      const rows = data?.dailyActivities || [];
      return Math.floor(calculate7DayAverage(rows, 'count'));
    },
  });
};

type LeaderboardResult = {
  json_value: { wallet_address: string; points: number };
};

const fetchTotalOlasContributors = async (): Promise<MetricWithStatus<number | null>> => {
  let skip = 0;
  let allResults: LeaderboardResult[] = [];

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = `${LEADERBOARD_BASE_URL}?skip=${skip}&limit=${LIMIT}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(LEADERBOARD_ERROR_MESSAGE);
        return {
          value: null,
          status: getFetchErrorAndCreateStaleStatus('contribute:total'),
        };
      }

      const pageData: LeaderboardResult[] = await response.json();

      allResults = allResults.concat(pageData);
      skip += LIMIT;

      if (!Array.isArray(pageData) || pageData.length === 0 || pageData.length < LIMIT) {
        break;
      }
    }

    const activeUsers = allResults.reduce((sum, user) => {
      if (!user.json_value.wallet_address) return sum;
      if (user.json_value.points === 0) return sum;
      return sum + 1;
    }, 0);

    return {
      value: activeUsers,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };
  } catch (error) {
    console.error(LEADERBOARD_ERROR_MESSAGE, error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('contribute:total'),
    };
  }
};

export const fetchContributeMetrics = async () => {
  try {
    const [totalOlasContributorsResult, daaResult] = await Promise.allSettled([
      fetchTotalOlasContributors(),
      fetchContributeDaa7dAvg(),
    ]);

    let dailyActiveContributors: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };

    let totalOlasContributors: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };

    if (totalOlasContributorsResult.status === 'fulfilled') {
      totalOlasContributors = totalOlasContributorsResult.value;
    } else {
      console.error(LEADERBOARD_ERROR_MESSAGE, totalOlasContributorsResult.reason);
      totalOlasContributors.status = getFetchErrorAndCreateStaleStatus('contribute:total');
    }

    if (daaResult.status === 'fulfilled') {
      dailyActiveContributors = daaResult.value;
    } else {
      console.error('Fetch DAA for contribute failed:', daaResult.reason);
      dailyActiveContributors.status = getFetchErrorAndCreateStaleStatus('contribute:daa');
    }

    return {
      totalOlasContributors,
      dailyActiveContributors,
    };
  } catch (error) {
    console.error('Error fetching contribute metrics:', error);
    return {
      totalOlasContributors: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('contribute:total'),
      },
      dailyActiveContributors: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('contribute:daa'),
      },
    };
  }
};
