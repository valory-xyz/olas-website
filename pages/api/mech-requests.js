/* eslint-disable no-console */
import { CACHE_DURATION_SECONDS } from 'common-util/constants';
import { ATA_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  mechGlobalsTotalRequestsQuery,
  mechMarketplaceTotalRequestsQuery,
} from 'common-util/graphql/queries';

const fetchMechRequestsFromSubgraphs = async () => {
  try {
    const [mechRes, mmGnosisRes, mmBaseRes] = await Promise.allSettled([
      ATA_GRAPH_CLIENTS.legacyMech.request(mechGlobalsTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.gnosis.request(mechMarketplaceTotalRequestsQuery),
      ATA_GRAPH_CLIENTS.base.request(mechMarketplaceTotalRequestsQuery),
    ]);

    const mechTotal = (() => {
      if (mechRes.status !== 'fulfilled') return 0;
      const v = mechRes.value;
      const fromGlobal = v?.global?.totalRequests;
      const fromGlobals = v?.globals?.[0]?.totalRequests;
      return Number(fromGlobal ?? fromGlobals ?? 0);
    })();

    const mmGnosisTotal = (() => {
      if (mmGnosisRes.status !== 'fulfilled') return 0;
      const v = mmGnosisRes.value;
      const fromGlobals = v?.globals?.[0]?.totalRequests;
      const fromGlobal = v?.global?.totalRequests;
      return Number(fromGlobals ?? fromGlobal ?? 0);
    })();

    const mmBaseTotal = (() => {
      if (mmBaseRes.status !== 'fulfilled') return 0;
      const v = mmBaseRes.value;
      const fromGlobals = v?.globals?.[0]?.totalRequests;
      const fromGlobal = v?.global?.totalRequests;
      return Number(fromGlobals ?? fromGlobal ?? 0);
    })();

    return {
      mech: mechTotal,
      marketplace: mmGnosisTotal + mmBaseTotal,
      total: mechTotal + mmGnosisTotal + mmBaseTotal,
    };
  } catch (error) {
    console.error('Error fetching mech requests from subgraphs:', error);
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
    const data = await fetchMechRequestsFromSubgraphs();
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in mech-requests handler:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch mech requests metrics.' });
  }
}
