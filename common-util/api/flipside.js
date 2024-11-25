import { get } from 'lodash';

const flipsideCryptoApiCall = async ({ queryId }) => {
  try {
    const response = await fetch(
      `https://flipsidecrypto.xyz/api/v1/queries/${queryId}/data/latest`,
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const TOTAL_TRANSACTION_QUERY_ID = '590baf05-1225-494a-8698-31f456f1122d';
export const getTotalTransactionsCount = async () => {
  const result = await flipsideCryptoApiCall({
    queryId: TOTAL_TRANSACTION_QUERY_ID,
  });
  const totalTransactions =
    get(result, "[0]['Cumulative transactions']") || null;
  return totalTransactions;
};

const UNITS_COUNT_ID = '0648695d-0383-4154-afda-e0bb153b1b70';
export const getTotalUnitsCount = async () => {
  const result = await flipsideCryptoApiCall({ queryId: UNITS_COUNT_ID });
  const agentTypesCount = get(result, '[1].TOTAL_MINTS') || null;
  const agentsCount = get(result, '[0].TOTAL_MINTS') || null;
  return { agentTypesCount, agentsCount };
};

const DAILY_ACTIVITY_ID = 'd874c1cb-a38d-4e11-bbe2-bc0c409b22c1';
export const get7DaysAvgActivity = async () => {
  const result = await flipsideCryptoApiCall({ queryId: DAILY_ACTIVITY_ID });
  const average = get(result, "[0]['7-day trailing avg']") || null;
  return Math.floor(average);
};

const SEVEN_DAY_AVG_DAILY_ACTIVE_AGENTS_ID =
  '276784c3-8481-4b46-9334-6e579b524628';
export const getSevenDayAvgDailyActiveAgents = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: SEVEN_DAY_AVG_DAILY_ACTIVE_AGENTS_ID,
    });
    const average = get(result, "[0]['AVG_7D_ACTIVE_AGENTS_COUNT']") || null;
    return Math.floor(average);
  } catch (error) {
    console.error('Error in getSevenDayAvgDailyActiveAgents: ', error);
    return null;
  }
};

const ALL_SERVICES_TRANSACTION_ID = '06d60f1a-aa57-4c84-a8a4-017e16839b01';
export const getPredictionTxs = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: ALL_SERVICES_TRANSACTION_ID,
    });
    const sortedByDate = result.sort(
      (a, b) => new Date(b['DAY']) - new Date(a['DAY']),
    );
    const traderTxs = sortedByDate.find(
      (row) => row['SERVICE_TYPE'] === 'Trader',
    )['TOTAL_TRANSACTIONS'];
    const mechTxs = sortedByDate.find((row) => row['SERVICE_TYPE'] === 'Mech')[
      'TOTAL_TRANSACTIONS'
    ];
    const marketCreatorTxs = sortedByDate.find(
      (row) => row['SERVICE_TYPE'] === 'Creator',
    )['TOTAL_TRANSACTIONS'];
    const totalTxs = traderTxs + mechTxs + marketCreatorTxs;
    return { traderTxs, mechTxs, marketCreatorTxs, totalTxs };
  } catch (error) {
    console.error('Error in getPredictionTxs: ', error);
    return null;
  }
};

const TOTAL_TOKEN_HOLDERS_ID = 'cdb4c1a1-707b-49f4-9629-cf34e811800c';
export const getTotalTokenHolders = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: TOTAL_TOKEN_HOLDERS_ID,
    });
    const totalTokenHolders = get(result, "[0]['TOTAL_HOLDERS']") || null;

    return totalTokenHolders;
  } catch (error) {
    console.error('Error in getTotalTokenHolders: ', error);
    return null;
  }
};

const OLAS_BONDED_ID = '97faaf2c-f0d3-46cb-8c23-5b7ee9fa7b89';
export const getOlasBonded = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: OLAS_BONDED_ID,
    });
    const olasBonded = get(result, "[0]['VOL_OLAS']") || null;
    return olasBonded;
  } catch (error) {
    console.error('Error in getOlasBonded: ', error);
    return null;
  }
};

const VEOLAS_CIRCULATING_SUPPLY_ID = '3d387d8d-0324-4476-b6b6-96ec2f4c60c1';
export const getVeOLASCirculatingSupply = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: VEOLAS_CIRCULATING_SUPPLY_ID,
    });
    const veOLASCirculatingSupply = get(result, "[0]['CIR_SUPPLY']") || null;
    return veOLASCirculatingSupply;
  } catch (error) {
    console.error('Error in getVeOLASCirculatingSupply: ', error);
  }
};
