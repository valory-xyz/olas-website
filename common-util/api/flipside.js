const flipsideCryptoApiCall = async ({ queryId }) => {
  try {
    const response = await fetch(`https://flipsidecrypto.xyz/api/v1/queries/${queryId}/data/latest`, {
      // headers: {
      //   'X-Dune-API-Key': process.env.NEXT_PUBLIC_FLIPSIDE_API_KEY,
      // },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const TOTAL_TRANSACTION_QUERY_ID = '590baf05-1225-494a-8698-31f456f1122d';
export const getTotalTransactionsCount = async () => {
  const queryResultSet = await flipsideCryptoApiCall({ queryId: TOTAL_TRANSACTION_QUERY_ID });
  const totalTransactions = queryResultSet[0]['Cumulative transactions'];
  return totalTransactions;
};

const UNITS_COUNT_ID = '0648695d-0383-4154-afda-e0bb153b1b70';
export const getTotalUnitsCount = async () => {
  const queryResultSet = await flipsideCryptoApiCall({ queryId: UNITS_COUNT_ID });
  return queryResultSet;
};
