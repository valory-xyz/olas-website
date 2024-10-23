import {
  MECH_RQS_QUERY_ID,
  PREDICTION_DAA_QUERY_ID,
  PREDICTION_TXS_BY_AGENT_TYPE_QUERY_ID,
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

export const getPredictionDaa = async () => {
  try {
    const json = await duneApiCall({ queryId: PREDICTION_DAA_QUERY_ID });
    const average = get(json, 'result.rows[0].avg_7d_active_agents_count');
    return Math.ceil(average);
  } catch (error) {
    console.error('Error in getPredictionDaa: ', error);
    return;
  }
};

export const getPredictionTxs = async () => {
  try {
    const json = await duneApiCall({
      queryId: PREDICTION_TXS_BY_AGENT_TYPE_QUERY_ID,
    });
    const traderTxs = get(
      json,
      'result.rows[0].cumulative_trader_transactions',
    );
    const mechTxs = get(json, 'result.rows[0].cumulative_mechs_transactions');
    const marketCreatorTxs = get(
      json,
      'result.rows[0].cumulative_market_creator_transactions',
    );
    const totalTxs = traderTxs + mechTxs + marketCreatorTxs;
    return { traderTxs, mechTxs, marketCreatorTxs, totalTxs };
  } catch (error) {
    console.error('Error in getPredictionTxs: ', error);
    return;
  }
};

export const getMechRqs = async () => {
  try {
    const json = await duneApiCall({
      queryId: MECH_RQS_QUERY_ID,
    });
    const predictRqs = get(
      json,
      'result.rows[0].predict_cumulative_transaction_count',
    );
    const contributeRqs = get(
      json,
      'result.rows[0].contribute_cumulative_transaction_count',
    );
    const governatooorRqs = get(
      json,
      'result.rows[0].governatoor_cumulative_transaction_count',
    );
    const otherRqs = get(
      json,
      'result.rows[0].other_cumulative_transaction_count',
    );
    const totalRqs = get(json, 'result.rows[0].total_cumulative_transactions');
    return { totalRqs, predictRqs, contributeRqs, governatooorRqs, otherRqs };
  } catch (error) {
    console.error('Error in getMechRqs: ', error);
    return;
  }
};
