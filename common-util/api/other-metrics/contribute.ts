import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { autonolasBaseGraphClient } from 'common-util/graphql/client';
import { dailyActivitiesQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const AGENT_TYPE = 14;
const ATTRIBUTE_TYPE_ID = 8;
const LIMIT = 1000;
const LEADERBOARD_BASE_URL = `${process.env.NEXT_PUBLIC_AFMDB_URL}/api/agent-types/${AGENT_TYPE}/attributes/${ATTRIBUTE_TYPE_ID}/values`;
const LEADERBOARD_ERROR_MESSAGE = 'Failed to fetch leaderboard.';

const fetchContributeDaa7dAvg = async () => {
  try {
    const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
    const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

    const result = (await autonolasBaseGraphClient.request(dailyActivitiesQuery, {
      where: {
        dayTimestamp_gt: String(timestamp_gt),
        dayTimestamp_lt: String(timestamp_lt),
      },
      orderBy: 'dayTimestamp',
      orderDirection: 'desc',
    } as any)) as any;

    const rows = result?.dailyActivities || [];
    const average = calculate7DayAverage(rows, 'count');
    return Math.floor(average);
  } catch (error) {
    console.error('Error fetching contribute DAA:', error);
    return null;
  }
};

const fetchTotalOlasContributors = async () => {
  let skip = 0;
  let allResults: any[] = [];

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = `${LEADERBOARD_BASE_URL}?skip=${skip}&limit=${LIMIT}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(LEADERBOARD_ERROR_MESSAGE);
        return null;
      }

      const pageData = (await response.json()) as any[];

      allResults = allResults.concat(pageData);
      skip += LIMIT;

      if (
        !Array.isArray(pageData) ||
        pageData.length === 0 ||
        pageData.length < LIMIT
      ) {
        break;
      }
    }

    const activeUsers = allResults.reduce((sum, user) => {
      if (!user.json_value.wallet_address) return sum;
      if (user.json_value.points === 0) return sum;
      return sum + 1;
    }, 0);

    return activeUsers;
  } catch (error) {
    console.error(LEADERBOARD_ERROR_MESSAGE, error);
    return null;
  }
};

export const fetchContributeMetrics = async () => {
  try {
    const [totalOlasContributorsResult, daaResult] = await Promise.allSettled([
      fetchTotalOlasContributors(),
      fetchContributeDaa7dAvg(),
    ]);

    const metrics: { totalOlasContributors: number | null; dailyActiveContributors: number | null } = {
      totalOlasContributors: null,
      dailyActiveContributors: null,
    };

    if (totalOlasContributorsResult.status === 'fulfilled') {
      metrics.totalOlasContributors = totalOlasContributorsResult.value;
    } else {
      console.error(
        LEADERBOARD_ERROR_MESSAGE,
        totalOlasContributorsResult.reason,
      );
    }

    if (daaResult.status === 'fulfilled') {
      metrics.dailyActiveContributors = daaResult.value;
    } else {
      console.error('Fetch DAA for contribute failed:', daaResult.reason);
    }

    return metrics;
  } catch (error) {
    console.error('Error fetching contribute metrics:', error);
    return null;
  }
};
