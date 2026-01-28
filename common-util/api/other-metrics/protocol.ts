import {
  TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID,
  TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID,
} from 'common-util/constants';
import { createStaleStatus } from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';
import get from 'lodash/get';

const duneApiFetch = async (queryId: string | number) => {
  const response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results`, {
    headers: {
      'X-Dune-API-Key': process.env.NEXT_PUBLIC_DUNE_API_KEY || '',
    },
  });
  const data = await response.json();

  if (data?.error) {
    throw new Error(`Dune API error: ${data.error}`);
  }

  if (!response.ok) {
    throw new Error(`Dune API error: ${response.statusText}`);
  }

  return data;
};

type ProtocolMetricsResult = {
  result: {
    rows: {
      protocol_owned_liquidity_value_across_chains: number;
      Cumulative_Protocol_Earned_Fees: number;
    }[];
  };
};

export const fetchProtocolMetrics = async () => {
  try {
    const [polResponse, revenueResponse] = await Promise.allSettled([
      duneApiFetch(TOTAL_PROTOCOL_OWNED_LIQUIDITY_ID) as Promise<ProtocolMetricsResult>,
      duneApiFetch(TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID) as Promise<ProtocolMetricsResult>,
    ]);

    let polMetric: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };

    if (polResponse.status === 'fulfilled') {
      polMetric.value = get(
        polResponse.value,
        'result.rows[0].protocol_owned_liquidity_value_across_chains'
      );
    } else {
      console.error('Error fetching protocol owned liquidity:', polResponse.reason);
      polMetric.status = createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['dune:pol'],
        laggingSubgraphs: [],
      });
    }

    let revenueMetric: MetricWithStatus<number | null> = {
      value: null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };

    if (revenueResponse.status === 'fulfilled') {
      revenueMetric.value = get(
        revenueResponse.value,
        'result.rows[0].Cumulative_Protocol_Earned_Fees'
      );
    } else {
      console.error('Error fetching protocol revenue:', revenueResponse.reason);
      revenueMetric.status = createStaleStatus({
        indexingErrors: [],
        fetchErrors: ['dune:revenue'],
        laggingSubgraphs: [],
      });
    }

    return {
      totalProtocolOwnedLiquidity: polMetric,
      totalProtocolRevenue: revenueMetric,
    };
  } catch (error) {
    console.error('Error fetching protocol metrics:', error);
    return {
      totalProtocolOwnedLiquidity: {
        value: null,
        status: createStaleStatus({
          indexingErrors: [],
          fetchErrors: ['dune:pol'],
          laggingSubgraphs: [],
        }),
      },
      totalProtocolRevenue: {
        value: null,
        status: createStaleStatus({
          indexingErrors: [],
          fetchErrors: ['dune:revenue'],
          laggingSubgraphs: [],
        }),
      },
    };
  }
};
