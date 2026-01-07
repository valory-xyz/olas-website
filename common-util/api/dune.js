import {
  TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
  TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
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
