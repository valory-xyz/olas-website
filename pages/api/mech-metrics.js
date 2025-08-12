import { REGISTRY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { dailyMechAgentPerformancesQuery } from 'common-util/graphql/queries';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const fetchDailyAgentPerformance = async () => {
  const timestamp_lt = Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000); // timestamp of today UTC midnight
  const timestamp_gt = getMidnightUtcTimestampDaysAgo(8); // timestamp of 8 days ago UTC midnight

  try {
    const [gnosisResult, baseResult] = await Promise.all([
      REGISTRY_GRAPH_CLIENTS.gnosis.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
      REGISTRY_GRAPH_CLIENTS.base.request(dailyMechAgentPerformancesQuery, {
        timestamp_gt,
        timestamp_lt,
      }),
    ]);

    const gnosisPerformances = gnosisResult.dailyAgentPerformances ?? [];
    const basePerformances = baseResult.dailyAgentPerformances ?? [];

    const performances = [...gnosisPerformances, ...basePerformances];

    if (performances.length === 0) return 0;

    const total = performances.reduce(
      (sum, p) => sum + Number(p.activeMultisigCount ?? 0),
      0,
    );

    const average = total / performances.length;

    return average;
  } catch (error) {
    console.error('Error fetching mech daily agent performances:', error);
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
    const latestMetrics = await fetchDailyAgentPerformance();
    if (latestMetrics) {
      return res.status(200).json(latestMetrics);
    }

    return res
      .status(404)
      .json({ error: 'Error fetching Daily Active Agents for mechs.' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch agent performance values.' });
  }
}
