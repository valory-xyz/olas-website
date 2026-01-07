import {
  MECH_FEES_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
} from 'common-util/graphql/client';
import {
  legacyMechFeesTotalsQuery,
  newMechFeesTotalsQuery,
} from 'common-util/graphql/queries';

export const fetchMechFeeMetrics = async () => {
  try {
    const [gnosisNew, baseNew, legacy] = await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesTotalsQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesTotalsQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesTotalsQuery),
    ]);

    const getSafe = (res: PromiseSettledResult<any>) =>
      res.status === 'fulfilled' ? res.value : null;

    const gnosisNewGlobal = getSafe(gnosisNew)?.global;
    const baseNewGlobal = getSafe(baseNew)?.global;
    const legacyGlobal = getSafe(legacy)?.global;

    const inUsd =
      Number(gnosisNewGlobal?.totalFeesInUSD || 0) +
      Number(baseNewGlobal?.totalFeesInUSD || 0) +
      Number(
        (BigInt(legacyGlobal?.totalFeesIn || '0') / BigInt(1e18)).toString()
      );

    const outUsd =
      Number(gnosisNewGlobal?.totalFeesOutUSD || 0) +
      Number(baseNewGlobal?.totalFeesOutUSD || 0) +
      Number(
        (BigInt(legacyGlobal?.totalFeesOut || '0') / BigInt(1e18)).toString()
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
