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
  return agentTypesCount;
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

const TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID =
  'a4e0cfab-5e69-4e92-938a-15d559610bac';
export const getTotalProtocolOwnedLiquidity = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
    });
    const totalOwnedLiquidity =
      get(result, "[0]['TOTAL_OWNED_LIQUIDITY']") || null;
    return totalOwnedLiquidity;
  } catch (error) {
    console.error('Error in getTotalProtocolOwnedLiquidity: ', error);
  }
};

const TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID =
  '377d716e-6ef5-44e1-a1dd-8af9b4b75a38';
export const getTotalProtocolRevenue = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
    });
    const totalProtocolRevenue =
      get(result, "[0]['Total protocol earned fee']") || null;
    return totalProtocolRevenue;
  } catch (error) {
    console.error('Error in getTotalProtocolRevenue: ', error);
  }
};

const VEOLAS_HOLDERS_ID = '2c18d82a-a51d-40e0-9944-f874c99ca52c';
export const getVeOlasHolders = async () => {
  try {
    const result = await flipsideCryptoApiCall({
      queryId: VEOLAS_HOLDERS_ID,
    });
    const veOlasHolders = get(result, "[0]['UNIQUE_DEPOSITOR_COUNT']") || null;
    return veOlasHolders;
  } catch (error) {
    console.error('Error in getVeOlasHolders: ', error);
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
