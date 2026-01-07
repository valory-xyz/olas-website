import { calculate7DayAverage } from 'common-util/calculate7DayAverage';
import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { dailyAgentsFunPerformancesQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = getMidnightUtcTimestampDaysAgo(0);
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8);

  const result = await REGISTRY_GRAPH_CLIENTS.base.request(
    dailyAgentsFunPerformancesQuery,
    { timestamp_gt, timestamp_lt },
  );

  // @ts-expect-error TS(2339) FIXME: Property 'dailyAgentPerformances' does not exist o... Remove this comment to see the full error message
  const performances = result.dailyAgentPerformances ?? [];
  return calculate7DayAverage(performances, 'activeMultisigCount');
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
    const dailyActiveAgents = await fetchDailyAgentPerformance();
    return res.status(200).json({ dailyActiveAgents });
  } catch (error) {
    console.error('Error fetching agents.fun metrics:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch agents.fun metrics.' });
  }
}
