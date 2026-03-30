import { OLAS_API_URL } from 'common-util/constants';
import {
  createStaleStatus,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { MetricWithStatus } from 'common-util/graphql/types';

export const fetchOlasTotalSupplyWei = async (): Promise<MetricWithStatus<string | null>> => {
  try {
    const response = await fetch(`${OLAS_API_URL}/total_supply`);
    if (!response.ok) {
      throw new Error(`OLAS total_supply HTTP ${response.status}`);
    }
    const json = (await response.json()) as { data?: { totalSupply?: string | number } };
    const raw = json?.data?.totalSupply;
    if (raw === undefined || raw === null) {
      throw new Error('OLAS total_supply: missing data.totalSupply');
    }
    return {
      value: String(raw),
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };
  } catch (error) {
    console.error('Error fetching OLAS total supply:', error);
    return {
      value: null,
      status: getFetchErrorAndCreateStaleStatus('olas-api:total-supply'),
    };
  }
};
