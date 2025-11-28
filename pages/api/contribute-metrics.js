import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { autonolasBaseGraphClient } from 'common-util/graphql/client';
import { dailyActivitiesQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const AGENT_TYPE = 14;
const ATTRIBUTE_TYPE_ID = 8;
const LIMIT = 1000;
const LEADERBOARD_BASE_URL = `${process.env.NEXT_PUBLIC_AFMDB_URL}/api/agent-types/${AGENT_TYPE}/attributes/${ATTRIBUTE_TYPE_ID}/values`;
const LEADERBOARD_ERROR_MESSAGE = 'Failed to fetch leaderboard.';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const fetchContributeDaa7dAvg = async () => {
  try {
    const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
    const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

    const { dailyActivities: rows = [] } =
      await autonolasBaseGraphClient.request(dailyActivitiesQuery, {
        where: {
          dayTimestamp_gt: String(timestamp_gt),
          dayTimestamp_lt: String(timestamp_lt),
        },
        orderBy: 'dayTimestamp',
        orderDirection: 'desc',
      });

    const average = calculate7DayAverage(rows, 'count');
    return Math.floor(average);
  } catch (error) {
    console.error('Error fetching contribute DAA:', error);
    return null;
  }
};

const fetchTotalOlasContributors = async () => {
  let skip = 0;
  let allResults = [];

  try {
    // Request all the users by pages
    while (true) {
      const url = `${LEADERBOARD_BASE_URL}?skip=${skip}&limit=${LIMIT}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(LEADERBOARD_ERROR_MESSAGE);
        return null;
      }

      const pageData = await response.json();

      allResults = allResults.concat(pageData);
      skip += LIMIT;

      // If the returned page is empty, or the amount of items is less
      // than the limit, we're on the last page
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
    console.error(LEADERBOARD_ERROR_MESSAGE);
    return null;
  }
};

const fetchAllContributeMetrics = async () => {
  try {
    const [totalOlasContributorsResult, daaResult] = await Promise.allSettled([
      fetchTotalOlasContributors(),
      fetchContributeDaa7dAvg(),
    ]);

    const metrics = {
      totalOlasContributors: null,
      dailyActiveContributors: null,
    };

    // Process the results from Promise.allSettled
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

    const data = {
      data: metrics,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching main metrics:', error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader(
    'Vercel-CDN-Cache-Control',
    `s-maxage=${CACHE_DURATION_SECONDS}`,
  );
  res.setHeader('CDN-Cache-Control', `s-maxage=${CACHE_DURATION_SECONDS}`);
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
  );

  try {
    const latestMetrics = await fetchAllContributeMetrics();
    if (latestMetrics) {
      return res.status(200).json(latestMetrics);
    }

    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch contribute metrics.' });
  }
}
