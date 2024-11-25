import {
  MECH_TXS_QUERY_ID,
  PROTOCOL_EARNED_FEES_ID,
  UNIQUE_STAKERS_QUERY_ID,
} from 'common-util/constants';
import get from 'lodash/get';

const duneApiCall = async ({ queryId }) => {
  const response = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results`,
    {
      headers: {
        'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Dune API, status: ${response.status}`,
    );
  }

  const json = await response.json();
  return json;
};

export const getMechTxs = async () => {
  try {
    const json = await duneApiCall({
      queryId: MECH_TXS_QUERY_ID,
    });
    const predictTxs = get(
      json,
      'result.rows[0].predict_cumulative_transaction_count',
    );
    const contributeTxs = get(
      json,
      'result.rows[0].contribute_cumulative_transaction_count',
    );
    const governatooorTxs = get(
      json,
      'result.rows[0].governatoor_cumulative_transaction_count',
    );
    const otherTxs = get(
      json,
      'result.rows[0].other_cumulative_transaction_count',
    );
    const totalTxs = get(json, 'result.rows[0].total_cumulative_transactions');
    return { totalTxs, predictTxs, contributeTxs, governatooorTxs, otherTxs };
  } catch (error) {
    console.error('Error in getMechTxs: ', error);
    return;
  }
};

export const getTotalUniqueStakers = async () => {
  try {
    const json = await duneApiCall({ queryId: UNIQUE_STAKERS_QUERY_ID });
    const totalUniqueStakers = get(json, 'result.rows[0].total_stakers');
    return totalUniqueStakers;
  } catch (error) {
    console.error('Error in getTotalUniqueStakers: ', error);
    return;
  }
};

export const getProtocolEarnedFees = async () => {
  try {
    const json = await duneApiCall({ queryId: PROTOCOL_EARNED_FEES_ID });
    const protocolEarnedFees = get(
      json,
      'result.rows[0].Cumulative_Protocol_Earned_Fees',
    );
    return protocolEarnedFees;
  } catch (error) {
    console.error('Error in getProtocolEarnedFees: ', error);
  }
};
