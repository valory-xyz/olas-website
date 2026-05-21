import { getSnapshot } from 'common-util/snapshot-storage';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Read-only public endpoint backing the `get_olas_metrics` WebMCP tool. Returns
 * the same headline metrics snapshot the homepage renders (daily active agents,
 * OLAS staked, transactions, ATA transactions, mech fees, operators). No
 * authentication — this is already-public marketing data.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await getSnapshot({ category: 'main' });

    if (!snapshot) {
      return res.status(200).json({ data: null, timestamp: null });
    }

    // Flatten MetricWithStatus → plain values for easy agent consumption, while
    // preserving the staleness flag.
    const data = Object.fromEntries(
      Object.entries(snapshot.data).map(([key, metric]) => [
        key,
        { value: metric?.value ?? null, stale: Boolean(metric?.status?.stale) },
      ])
    );

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ data, timestamp: snapshot.timestamp });
  } catch (error) {
    console.error('Error serving agent-tools metrics:', error);
    return res.status(500).json({ error: 'Failed to load metrics' });
  }
}
