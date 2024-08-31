import { get } from 'lodash';

const flipsideCryptoApiCall = async ({ queryId }) => {
  try {
    const response = await fetch(`https://flipsidecrypto.xyz/api/v1/queries/${queryId}/data/latest`);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const TOTAL_TRANSACTION_QUERY_ID = '590baf05-1225-494a-8698-31f456f1122d';
export const getTotalTransactionsCount = async () => {
  const result = await flipsideCryptoApiCall({ queryId: TOTAL_TRANSACTION_QUERY_ID });
  const totalTransactions = get(result, "[0]['Cumulative transactions']") || null;
  return totalTransactions;
};

const UNITS_COUNT_ID = '0648695d-0383-4154-afda-e0bb153b1b70';
export const getTotalUnitsCount = async () => {
  const result = await flipsideCryptoApiCall({ queryId: UNITS_COUNT_ID });
  const agentTypesCount = get(result, '[1].TOTAL_MINTS') || null;
  const agentsCount = get(result, '[0].TOTAL_MINTS') || null;
  return { agentTypesCount, agentsCount };
};
