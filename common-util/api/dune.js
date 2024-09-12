import get from 'lodash/get';
import { DAILY_ACTIVE_AGENTS_DUNE_QUERY_ID } from 'common-util/constants';

const duneApiCall = async ({ queryId }) => {
  try {
    const response = await fetch(
      `https://api.dune.com/api/v1/query/${queryId}/results`,
      {
        headers: {
          "X-Dune-API-Key": process.env.NEXT_PUBLIC_DUNE_API_KEY,
        },
      }
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
};

export const getDailyActiveAgentsAverage = async () => {
  const json = await duneApiCall({
    queryId: DAILY_ACTIVE_AGENTS_DUNE_QUERY_ID,
  });
  const average = get(json, "result.rows[0].seven_day_trailing_avg");
  return Math.ceil(average);
};
