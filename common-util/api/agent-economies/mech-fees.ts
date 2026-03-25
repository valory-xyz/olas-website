import { MECH_FEES_GRAPH_CLIENTS, legacyMechFeesGraphClient } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import { legacyMechFeesTotalsQuery, newMechFeesTotalsQuery } from 'common-util/graphql/queries';
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
  const laggingSubgraphs: string[] = [];

  try {
    const chainKeys = Object.keys(MECH_FEES_GRAPH_CLIENTS) as Array<
      keyof typeof MECH_FEES_GRAPH_CLIENTS
    >;

    const allResults = await Promise.allSettled([
      ...chainKeys.map((chain) => MECH_FEES_GRAPH_CLIENTS[chain].request(newMechFeesTotalsQuery)),
      legacyMechFeesGraphClient.request(legacyMechFeesTotalsQuery),
      ...chainKeys.map((chain) => getChainBlockNumber(chain)),
    ]);

    const newFeeResults = allResults.slice(
      0,
      chainKeys.length
    ) as PromiseSettledResult<MechFeesResult>[];
    const legacyResult = allResults[chainKeys.length] as PromiseSettledResult<LegacyMechFeesResult>;
    const blockResults = allResults.slice(chainKeys.length + 1) as PromiseSettledResult<
      number | null
    >[];

    let inUsd = 0;
    let outUsd = 0;

    chainKeys.forEach((chain, i) => {
      const res = newFeeResults[i];
      const latestBlock = blockResults[i].status === 'fulfilled' ? blockResults[i].value : null;

      if (res.status === 'rejected') {
        fetchErrors.push(`mechFees:${chain}`);
        return;
      }
      if (res.value?._meta?.hasIndexingErrors) {
        indexingErrors.push(`mechFees:${chain}`);
      }
      if (checkSubgraphLag(latestBlock, res.value?._meta?.block?.number, chain)) {
        laggingSubgraphs.push(`mechFees:${chain}`);
      }
      inUsd += Number(res.value?.global?.totalFeesInUSD || 0);
      outUsd += Number(res.value?.global?.totalFeesOutUSD || 0);
    });

    // Add legacy Gnosis fees (wei-denominated)
    if (legacyResult.status === 'rejected') {
      fetchErrors.push('mechFees:legacy');
    } else {
      const legacy = legacyResult.value;
      if (legacy?._meta?.hasIndexingErrors) {
        indexingErrors.push('mechFees:legacy');
      }
      const gnosisIdx = chainKeys.indexOf('gnosis');
      const gnosisBlock =
        gnosisIdx >= 0 && blockResults[gnosisIdx]?.status === 'fulfilled'
          ? blockResults[gnosisIdx].value
          : null;
      if (checkSubgraphLag(gnosisBlock, legacy?._meta?.block?.number, 'legacy')) {
        laggingSubgraphs.push('mechFees:legacy');
      }
      inUsd += Number((BigInt(legacy?.global?.totalFeesIn || '0') / BigInt(1e18)).toString());
      outUsd += Number((BigInt(legacy?.global?.totalFeesOut || '0') / BigInt(1e18)).toString());
    }

    const unclaimed = Math.max(inUsd - outUsd, 0);
    const status = createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs });
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
    const errorStatus = createStaleStatus({
      indexingErrors: [],
      fetchErrors: ['mechFees:all'],
      laggingSubgraphs: [],
    });
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
