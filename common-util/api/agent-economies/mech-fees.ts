import {
  MECH_FEES_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
} from 'common-util/graphql/client';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import {
  legacyMechFeesTotalsQuery,
  newMechFeesTotalsQuery,
} from 'common-util/graphql/queries';
import { WithMeta } from 'common-util/graphql/types';

type MechFeesResult = WithMeta<{
  global: {
    totalFeesInUSD: string;
    totalFeesOutUSD: string;
  };
}>;

type LegacyMechFeesResult = WithMeta<{
  global: {
    totalFeesIn: string;
    totalFeesOut: string;
  };
}>;

export const fetchMechFeeMetrics = async () => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];

  try {
    const [gnosisNew, baseNew, legacy] = (await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesTotalsQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesTotalsQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesTotalsQuery),
    ])) as [
      PromiseSettledResult<MechFeesResult>,
      PromiseSettledResult<MechFeesResult>,
      PromiseSettledResult<LegacyMechFeesResult>,
    ];

    const getNewMechFees = (
      res: PromiseSettledResult<MechFeesResult>,
      source: string,
    ): MechFeesResult['global'] | null => {
      if (res.status === 'rejected') {
        fetchErrors.push(`mechFees:${source}`);
        return null;
      }
      if (res.value?._meta?.hasIndexingErrors) {
        indexingErrors.push(`mechFees:${source}`);
      }
      return res.value?.global ?? null;
    };

    const getLegacyMechFees = (
      res: PromiseSettledResult<LegacyMechFeesResult>,
      source: string,
    ): LegacyMechFeesResult['global'] | null => {
      if (res.status === 'rejected') {
        fetchErrors.push(`mechFees:${source}`);
        return null;
      }
      if (res.value?._meta?.hasIndexingErrors) {
        indexingErrors.push(`mechFees:${source}`);
      }
      return res.value?.global ?? null;
    };

    const gnosisNewGlobal = getNewMechFees(gnosisNew, 'gnosis');
    const baseNewGlobal = getNewMechFees(baseNew, 'base');
    const legacyGlobal = getLegacyMechFees(legacy, 'legacy');

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
    const status = createStaleStatus(indexingErrors, fetchErrors);
    const createMetric = (value: number) => ({ value, status });

    return {
      totalFees: createMetric(Number(inUsd.toFixed(6))),
      claimedFees: createMetric(Number(outUsd.toFixed(6))),
      recievedFees: createMetric(Number(outUsd.toFixed(6))),
      unclaimedFees: createMetric(Number(unclaimed.toFixed(6))),
      protocolFees: createMetric(0),
      olasBurned: createMetric(0),
    };
  } catch (error) {
    console.error('Error fetching mech fees from subgraphs:', error);
    const errorStatus = createStaleStatus([], ['mechFees:all']);
    const errorMetric = { value: null, status: errorStatus };
    return {
      totalFees: errorMetric,
      claimedFees: errorMetric,
      recievedFees: errorMetric,
      unclaimedFees: errorMetric,
      protocolFees: errorMetric,
      olasBurned: errorMetric,
    };
  }
};
