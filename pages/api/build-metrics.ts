import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import { autonolasGraphClient } from 'common-util/graphql/client';
import { totalBuildersQuery } from 'common-util/graphql/queries';

const fetchTotalBuilders = async () => {
  try {
    const result = await autonolasGraphClient.request(totalBuildersQuery);

    // @ts-expect-error TS(2339) FIXME: Property 'globals' does not exist on type 'unknown... Remove this comment to see the full error message
    const globals = result?.globals || [];
    if (globals.length === 0) {
      return null;
    }
    return Number(globals[0]?.totalBuilders || 0);
  } catch (error) {
    throw error;
  }
};

const fetchAllBuildMetrics = async () => {
  try {
    const [totalBuildersResult] = await Promise.allSettled([
      fetchTotalBuilders(),
    ]);

    const metrics = {
      totalBuilders: null,
    };

    if (totalBuildersResult.status === 'fulfilled') {
      metrics.totalBuilders = totalBuildersResult.value;
    } else {
      console.error('Fetch Total Builders failed:', totalBuildersResult.reason);
    }

    const data = {
      data: metrics,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error('Error fetching build metrics:', error);
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
    const latestMetrics = await fetchAllBuildMetrics();
    if (latestMetrics) {
      return res.status(200).json(latestMetrics);
    }

    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to fetch build metrics.' });
  }
}
