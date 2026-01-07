import {
  ATA_GRAPH_CLIENTS,
  MECH_FEES_GRAPH_CLIENTS,
  legacyMechFeesGraphClient,
} from 'common-util/graphql/client';
import {
  ataTransactionsQuery,
  legacyMechFeesQuery,
  newMechFeesQuery,
} from 'common-util/graphql/queries';

export const fetchAtaTransactions = async () => {
  try {
    const results = await Promise.allSettled([
      ATA_GRAPH_CLIENTS.gnosis.request(ataTransactionsQuery),
      ATA_GRAPH_CLIENTS.base.request(ataTransactionsQuery),
      ATA_GRAPH_CLIENTS.legacyMech.request(ataTransactionsQuery),
    ]);

    const ataTransactionsByChains = results
      .filter((result) => result.status === 'fulfilled')
      // @ts-expect-error TS(2339) FIXME: Property 'value' does not exist on type 'PromiseSe... Remove this comment to see the full error message
      .map((result) => result.value?.globals?.[0]?.totalAtaTransactions || '0');

    return ataTransactionsByChains
      .reduce((sum, ataTxByChain) => sum + BigInt(ataTxByChain), BigInt(0))
      .toString();
  } catch (error) {
    console.error('Error fetching ATA transactions:', error);
    return null;
  }
};

export const fetchMechFees = async () => {
  try {
    const results = await Promise.allSettled([
      MECH_FEES_GRAPH_CLIENTS.gnosis.request(newMechFeesQuery),
      MECH_FEES_GRAPH_CLIENTS.base.request(newMechFeesQuery),
      legacyMechFeesGraphClient.request(legacyMechFeesQuery),
    ]);

    let totalFees = 0;

    results.forEach((result, index) => {
      // @ts-expect-error TS(2339) FIXME: Property 'global' does not exist on type 'unknown'... Remove this comment to see the full error message
      if (result.status === 'fulfilled' && result.value?.global) {
        // @ts-expect-error TS(2339) FIXME: Property 'global' does not exist on type 'unknown'... Remove this comment to see the full error message
        const feeValue = result.value.global;

        if (index === 2) {
          // Legacy mech fees (index 2) - convert from wei to XDAI
          const weiValue = feeValue.totalFeesIn || '0';
          const xdaiValue = Number(weiValue) / 10 ** 18;
          totalFees += xdaiValue;
        } else {
          // New mech fees (indices 0, 1) - already in USD
          const usdValue = Number(feeValue.totalFeesInUSD || '0');
          totalFees += usdValue;
        }
      }
    });

    return totalFees.toFixed(2);
  } catch (error) {
    console.error('Error fetching mech fees:', error);
    return null;
  }
};
