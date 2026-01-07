import {
  TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
  TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
} from 'common-util/constants';
import get from 'lodash/get';

const duneApiFetch = async (queryId: string | number) => {
  const response = await fetch(
    `https://api.dune.com/api/v1/query/${queryId}/results`,
    {
      headers: {
        'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY || '',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Dune API error: ${response.statusText}`);
  }

  return response.json();
};

export const fetchProtocolMetrics = async () => {
  try {
    const [polResponse, revenueResponse] = await Promise.allSettled([
      duneApiFetch(TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID),
      duneApiFetch(TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID),
    ]);

    const metrics: {
      totalProtocolOwnedLiquidity: number | null;
      totalProtocolRevenue: number | null;
    } = {
      totalProtocolOwnedLiquidity: null,
      totalProtocolRevenue: null,
    };

    if (polResponse.status === 'fulfilled') {
      metrics.totalProtocolOwnedLiquidity = get(
        polResponse.value,
        'result.rows[0].protocol_owned_liquidity_value_across_chains',
      );
    }

    if (revenueResponse.status === 'fulfilled') {
      metrics.totalProtocolRevenue = get(
        revenueResponse.value,
        'result.rows[0].Cumulative_Protocol_Earned_Fees',
      );
    }

    return metrics;
  } catch (error) {
    console.error('Error fetching protocol metrics:', error);
    return null;
  }
};
