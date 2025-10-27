import { fetchAtaTransactions, fetchMechFees } from 'common-util/api/metrics';
import { CACHE_DURATION_SECONDS } from 'common-util/constants';

export default async function handler(req, res) {
  try {
    const [ataTransactions, mechFees] = await Promise.all([
      fetchAtaTransactions(),
      fetchMechFees(),
    ]);

    const metrics = {
      ataTransactions,
      mechFees,
    };

    // Set cache headers
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate`,
    );
    res.setHeader(
      'Vercel-CDN-Cache-Control',
      `public, s-maxage=${CACHE_DURATION_SECONDS}`,
    );

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching marketplace metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
