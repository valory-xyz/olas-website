import {
  MECH_FEES_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
} from 'common-util/graphql/client';
import {
  legacyMechFeesTotalsQuery,
  newMechFeesTotalsQuery,
} from 'common-util/graphql/queries';

const CACHE_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

const fetchMechFeesFromSubgraphs = async () => {
  try {
    const [gnosisNew, baseNew, legacy] = await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesTotalsQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesTotalsQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesTotalsQuery),
    ]);

    const getSafe = (res) => (res.status === 'fulfilled' ? res.value : null);

    const gnosisNewGlobal = getSafe(gnosisNew)?.global;
    const baseNewGlobal = getSafe(baseNew)?.global;
    const legacyGlobal = getSafe(legacy)?.global;

    const inUsd =
      Number(gnosisNewGlobal?.totalFeesInUSD || 0) +
      Number(baseNewGlobal?.totalFeesInUSD || 0) +
      Number(
        (BigInt(legacyGlobal?.totalFeesIn || '0') / BigInt(1e18)).toString(),
      );

    const outUsd =
      Number(gnosisNewGlobal?.totalFeesOutUSD || 0) +
      Number(baseNewGlobal?.totalFeesOutUSD || 0) +
      Number(
        (BigInt(legacyGlobal?.totalFeesOut || '0') / BigInt(1e18)).toString(),
      );

    const unclaimed = Math.max(inUsd - outUsd, 0);

    return {
      totalFees: Number(inUsd.toFixed(6)),
      claimedFees: Number(outUsd.toFixed(6)),
      recievedFees: Number(outUsd.toFixed(6)),
      unclaimedFees: Number(unclaimed.toFixed(6)),
      protocolFees: 0,
      olasBurned: 0,
    };
  } catch (error) {
    console.error('Error fetching mech fees from subgraphs:', error);
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
    const data = await fetchMechFeesFromSubgraphs();
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json({ error: 'Data is empty' });
  } catch (error) {
    console.error('Error in mech-fees handler:', error);
    return res.status(500).json({ error: 'Failed to fetch mech fee metrics.' });
  }
}
