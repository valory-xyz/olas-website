import {
  A2A_TRANSACTIONS_ID,
  DAILY_CONTRIBUTORS_QUERY_ID,
  FEE_FLOW_QUERY_ID,
  MECH_TXS_QUERY_ID,
  OLAS_STAKED_QUERY_ID,
  TOTAL_MECH_TXS_ID,
  UNIQUE_BUILDERS_QUERY_ID,
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
    const predictTxs = get(json, 'result.rows[2].num_requests');
    const contributeTxs = get(json, 'result.rows[3].num_requests');
    const governatooorrTxs = get(json, 'result.rows[1].num_requests');
    const otherTxs = get(json, 'result.rows[0].num_requests');
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

export const getA2ATransactions = async () => {
  try {
    const json = await duneApiCall({
      queryId: A2A_TRANSACTIONS_ID,
    });
    const agentToAgentTxs = get(json, 'result.rows[0].total_a2a_transactions');
    return agentToAgentTxs;
  } catch (error) {
    console.error('Error in getA2ATransactions: ', error);
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
    const olasBurned = get(json, 'result.rows[0].OLAS_Burned');
    return { totalFees, claimedFees, unclaimedFees, recievedFees, olasBurned };
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
