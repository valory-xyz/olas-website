import {
  DAA_QUERY_ID,
  DAILY_CONTRIBUTORS_QUERY_ID,
  FEE_FLOW_QUERY_ID,
  MECH_TXS_QUERY_ID,
  OLAS_STAKED_QUERY_ID,
  PREDICTION_TOTAL_TXS_QUERY_ID,
  TOTAL_MECH_TXS_ID,
  TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
  TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
  TOTAL_SERVICE_TRANSACTIONS_QUERY_ID,
  TOTAL_TOKEN_HOLDERS_ID,
  UNIQUE_BUILDERS_QUERY_ID,
  UNIQUE_STAKERS_QUERY_ID,
  VEOLAS_CIRCULATING_SUPPLY_ID,
  VEOLAS_HOLDERS_ID,
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

export const getTotalTokenHolders = async () => {
  try {
    const json = await duneApiCall({
      queryId: TOTAL_TOKEN_HOLDERS_ID,
    });
    const tokenHolders = get(
      json,
      'result.rows[0].Num_OLAS_holders_across_chains',
    );
    return tokenHolders;
  } catch (error) {
    console.error('Error in getTotalTokenHolders: ', error);
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

export const getTotalMechTxs = async () => {
  try {
    const json = await duneApiCall({
      queryId: TOTAL_MECH_TXS_ID,
    });
    const totalTxs = get(json, 'result.rows[0].request_number');
    return totalTxs;
  } catch (error) {
    console.error('Error in getTotalMechTxs: ', error);
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

export const getFeeFlowMetrics = async () => {
  try {
    const json = await duneApiCall({
      queryId: FEE_FLOW_QUERY_ID,
    });
    const totalFees = get(json, 'result.rows[0].Total_Agent_Fees_Collected');
    const claimedFees = get(json, 'result.rows[0].Claimed_Fees');
    const unclaimedFees = get(json, 'result.rows[0].Unclaimed_Fees');
    const recievedFees = get(json, 'result.rows[0].Recieved_Fees');
    const protocolFees = get(json, 'result.rows[0].Protocol_fee_collected');
    const olasBurned = get(json, 'result.rows[0].OLAS_Burned');
    return {
      totalFees,
      claimedFees,
      unclaimedFees,
      recievedFees,
      protocolFees,
      olasBurned,
    };
  } catch (error) {
    console.error('Error in getFeeFlowMetrics: ', error);
    return;
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

export const getVeOlasHolders = async () => {
  try {
    const json = await duneApiCall({
      queryId: VEOLAS_HOLDERS_ID,
    });
    const olasHolders = get(json, 'result.rows[0].veOLAS_holders');
    return olasHolders;
  } catch (error) {
    console.error('Error in getVeOlasHolders: ', error);
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
