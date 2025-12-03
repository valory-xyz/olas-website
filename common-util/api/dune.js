import {
  DAA_QUERY_ID,
  MECH_TXS_QUERY_ID,
  OLAS_STAKED_QUERY_ID,
  PREDICTION_TOTAL_TXS_QUERY_ID,
  TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
  TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
  TOTAL_SERVICE_TRANSACTIONS_QUERY_ID,
  UNIQUE_STAKERS_QUERY_ID,
  VEOLAS_CIRCULATING_SUPPLY_ID,
} from 'common-util/constants';
import get from 'lodash/get';

const duneApiCall = async ({ queryId }) => {
  const response = await fetch(`/api/dune?queryId=${queryId}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from Dune API, status: ${response.status}`,
    );
  }

  const json = await response.json();
  return json;
};

export const get7DaysAvgActivity = async () => {
  try {
    const json = await duneApiCall({
      queryId: DAA_QUERY_ID,
    });
    const average = get(json, 'result.rows[0].seven_day_trailing_avg');
    return Math.floor(average);
  } catch (error) {
    console.error('Error in get7DaysAvgActivity: ', error);
    return;
  }
};

export const getTotalTransactionsCount = async () => {
  try {
    const json = await duneApiCall({
      queryId: TOTAL_SERVICE_TRANSACTIONS_QUERY_ID,
    });
    const totalTxs = get(json, 'result.rows[0].total_agent_txs');
    return totalTxs;
  } catch (error) {
    console.error('Error in getTotalTransactionsCount: ', error);
    return;
  }
};

export const getTotalPredictTransactions = async () => {
  try {
    const json = await duneApiCall({
      queryId: PREDICTION_TOTAL_TXS_QUERY_ID,
    });
    const totalTxs = get(json, 'result.rows[0].transactions_number');
    return totalTxs;
  } catch (error) {
    console.error('Error in getTotalPredictTransactions: ', error);
    return;
  }
};

export const getMechTxs = async () => {
  try {
    const json = await duneApiCall({
      queryId: MECH_TXS_QUERY_ID,
    });
    const predictTxs = get(json, 'result.rows[1].num_requests');
    const contributeTxs = get(json, 'result.rows[2].num_requests');
    const governatooorrTxs = get(json, 'result.rows[0].num_requests');
    const otherTxs = get(json, 'result.rows[3].num_requests');
    return { predictTxs, contributeTxs, governatooorrTxs, otherTxs };
  } catch (error) {
    console.error('Error in getMechTxs: ', error);
    return;
  }
};

export const getTotalUniqueStakers = async () => {
  try {
    const json = await duneApiCall({ queryId: UNIQUE_STAKERS_QUERY_ID });
    const totalUniqueStakers = get(json, 'result.rows[0].unique_operators');
    return totalUniqueStakers;
  } catch (error) {
    console.error('Error in getTotalUniqueStakers: ', error);
    return;
  }
};

export const getUniqueOperatorCount = async () => {
  try {
    const json = await duneApiCall({
      queryId: 5200009,
    });
    const agents = get(json, 'result.rows[0].unique_operators');
    return agents;
  } catch (error) {
    console.error('Error in getUniqueOperatorCount: ', error);
  }
};

export const getTotalOlasStaked = async () => {
  try {
    const json = await duneApiCall({
      queryId: OLAS_STAKED_QUERY_ID,
    });
    const totalOlasStaked = get(json, 'result.rows[0].total_balance_in_eth');
    return totalOlasStaked;
  } catch (error) {
    console.error('Error in getTotalOlasStaked: ', error);
    return;
  }
};

export const getVeOlasCirculatingSupply = async () => {
  try {
    const json = await duneApiCall({
      queryId: VEOLAS_CIRCULATING_SUPPLY_ID,
    });
    const olasLocked = get(json, 'result.rows[0].olas_locked');
    return olasLocked;
  } catch (error) {
    console.error('Error in getVeOlasCirculatingSupply: ', error);
    return;
  }
};

export const getTotalProtocolOwnedLiquidity = async () => {
  try {
    const json = await duneApiCall({
      queryId: TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
    });
    const totalOwnedLiquidity = get(
      json,
      'result.rows[0].protocol_owned_liquidity_value_across_chains',
    );
    return totalOwnedLiquidity;
  } catch (error) {
    console.error('Error in getTotalProtocolOwnedLiquidity: ', error);
    return;
  }
};

export const getTotalProtocolRevenue = async () => {
  try {
    const json = await duneApiCall({
      queryId: TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
    });
    const totalProtocolRevenue = get(
      json,
      'result.rows[0].Cumulative_Protocol_Earned_Fees',
    );
    return totalProtocolRevenue;
  } catch (error) {
    console.error('Error in getTotalProtocolRevenue: ', error);
    return;
  }
};
