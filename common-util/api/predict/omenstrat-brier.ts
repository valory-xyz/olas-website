import { predictAgentsGraphClient } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
} from 'common-util/graphql/metric-utils';
import { getOmenDailyBrierStatsQuery } from 'common-util/graphql/queries';
import { MetricWithStatus, WithMeta } from 'common-util/graphql/types';
import { getMidnightUtcTimestampDaysAgo } from 'common-util/time';

export type WindowKey = '7d' | '30d' | '90d' | 'max';
export type WindowedMetric<T> = Record<WindowKey, T>;

const LIMIT = 1000;
const BRIER_SCALE = 10n ** 18n; // brierSum is 1e18-scaled (see predict-omen schema)

type DailyBrierStat = {
  date: string;
  brierSum: string;
  brierCount: number;
};

type DailyBrierStatsResponse = WithMeta<{
  dailyProfitStatistics: DailyBrierStat[];
}>;

const emptyWindows = (): WindowedMetric<number | null> => ({
  '7d': null,
  '30d': null,
  '90d': null,
  max: null,
});

// meanBrier = sum(brierSum) / sum(brierCount). Both are 1e18-scaled and summable
// across days; dividing the BigInt sum by count and de-scaling yields a [0, 1] value.
// Keep 4 decimals of precision before downcasting to a JS number.
const computeMeanBrier = (sum: bigint, count: number): number | null => {
  if (count === 0) return null;
  return Number((sum * 10000n) / BigInt(count) / BRIER_SCALE) / 10000;
};

export const fetchOmenstratBrier = async (): Promise<
  MetricWithStatus<WindowedMetric<number | null>>
> => {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const cutoff7d = getMidnightUtcTimestampDaysAgo(7);
    const cutoff30d = getMidnightUtcTimestampDaysAgo(30);
    const cutoff90d = getMidnightUtcTimestampDaysAgo(90);

    const gnosisBlock = await getChainBlockNumber('gnosis');

    // Accumulate one pass over every settlement day; derive sub-windows by cutoff.
    const buckets: WindowedMetric<{ sum: bigint; count: number }> = {
      '7d': { sum: 0n, count: 0 },
      '30d': { sum: 0n, count: 0 },
      '90d': { sum: 0n, count: 0 },
      max: { sum: 0n, count: 0 },
    };

    let skip = 0;
    let metaChecked = false;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = (await predictAgentsGraphClient.request(
        getOmenDailyBrierStatsQuery({ date_gte: 0, date_lte: getMidnightUtcTimestampDaysAgo(0), first: LIMIT, skip })
      )) as DailyBrierStatsResponse;

      if (!metaChecked) {
        if (response?._meta?.hasIndexingErrors) {
          indexingErrors.push('predict:gnosis');
        }
        if (gnosisBlock && checkSubgraphLag(gnosisBlock, response?._meta?.block?.number, 'gnosis')) {
          laggingSubgraphs.push('predict:gnosis');
        }
        metaChecked = true;
      }

      const rows = response?.dailyProfitStatistics || [];

      rows.forEach((row) => {
        const date = Number(row.date);
        const sum = BigInt(row.brierSum || 0);
        const count = Number(row.brierCount || 0);
        if (count === 0) return;

        buckets.max.sum += sum;
        buckets.max.count += count;
        if (date >= cutoff90d) {
          buckets['90d'].sum += sum;
          buckets['90d'].count += count;
        }
        if (date >= cutoff30d) {
          buckets['30d'].sum += sum;
          buckets['30d'].count += count;
        }
        if (date >= cutoff7d) {
          buckets['7d'].sum += sum;
          buckets['7d'].count += count;
        }
      });

      if (rows.length < LIMIT) break;
      skip += LIMIT;
    }

    return {
      value: {
        '7d': computeMeanBrier(buckets['7d'].sum, buckets['7d'].count),
        '30d': computeMeanBrier(buckets['30d'].sum, buckets['30d'].count),
        '90d': computeMeanBrier(buckets['90d'].sum, buckets['90d'].count),
        max: computeMeanBrier(buckets.max.sum, buckets.max.count),
      },
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching Omenstrat Brier score:', error);
    fetchErrors.push('predict:gnosis:brier');
    return {
      value: emptyWindows(),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  }
};
