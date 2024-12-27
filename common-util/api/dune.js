import {
  A2A_TRANSACTIONS_QUERY_ID,
  DAILY_CONTRIBUTORS_QUERY_ID,
  MECH_TXS_QUERY_ID,
  UNIQUE_BUILDERS_QUERY_ID,
  UNIQUE_STAKERS_QUERY_ID,
  VEOLAS_HOLDERS_QUERY_ID,
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

export const getTotalUniqueBuilders = async () => {
  try {
    const json = await duneApiCall({ queryId: UNIQUE_BUILDERS_QUERY_ID });
    const TotalUniqueBuilders = get(json, 'result.rows[0].unique_minter_count');
    return TotalUniqueBuilders;
  } catch (error) {
    console.error('Error in getTotalUniqueBuilders: ', error);
    return;
  }
};

export const getVeOlasHolders = async () => {
  try {
    const json = await duneApiCall({ queryId: VEOLAS_HOLDERS_QUERY_ID });
    const veOlasHolders = get(json, 'result.rows[0].unique_depositor_count');
    return veOlasHolders;
  } catch (error) {
    console.error('Error in getVeOlasHolders: ', error);
    return;
  }
};

export const getA2ATransactions = async () => {
  try {
    const json = await duneApiCall({ queryId: A2A_TRANSACTIONS_QUERY_ID });
    const a2aTransactions = get(json, 'result.rows[0].total_requests');
    return a2aTransactions;
  } catch (error) {
    console.error('Error in getA2ATransactions: ', error);
    return;
  }
};

export const get7DayAvgDailyActiveContributors = async () => {
  try {
    const json = await duneApiCall({ queryId: DAILY_CONTRIBUTORS_QUERY_ID });
    const dailyActiveContributors = get(json, 'result.rows[0].active_services');
    return dailyActiveContributors;
  } catch (error) {
    console.error('Error in get7DayAvgDailyActiveContributors: ', error);
    return;
  }
};
