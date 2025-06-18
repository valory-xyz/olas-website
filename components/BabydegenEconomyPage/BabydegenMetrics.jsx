import { useMemo } from 'react';

import { getAverageAprs } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';

const MODIUS_HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Modius-Agent-Performance';
const OPTIMUS_HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Optimus-Agent-Performance';

const fetchMetrics = async () => {
  try {
    const averageAprs = await getAverageAprs();

    return {
      modius: {
        latestAvgApr: averageAprs?.modius?.latestAvgApr || null,
        latestETHApr: averageAprs?.modius?.latestETHApr || null,
      },
      optimus: {
        latestAvgApr: averageAprs?.optimus?.latestAvgApr || null,
        latestETHApr: averageAprs?.optimus?.latestETHApr || null,
      },
    };
  } catch (error) {
    console.error('Error fetching average Aprs:', error);
    return { modius: null, optimus: null };
  }
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num?.toFixed(1));
  return `${numTo1dp}%`;
};

const MetricsBubble = ({ metrics, sourceUrl, name }) => {
  const data = useMemo(
    () => [
      {
        id: 'toETH',
        subText: 'Relative to ETH',
        value: metrics?.latestAvgApr
          ? formatNumber(metrics.latestAvgApr)
          : null,
        source: sourceUrl,
      },
      {
        id: 'toUSDC',
        subText: 'Relative to USDC',
        value: metrics?.latestETHApr
          ? formatNumber(metrics.latestETHApr)
          : null,
        source: sourceUrl,
      },
    ],
    [metrics, sourceUrl],
  );

  return (
    <Card className="p-6 border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
      <div className="text-center mb-6">
        <div className="font-bold">{name}</div>
        <span className="text-lg text-black max-w-fit">
          📈 APR - Moving Average 7d
        </span>
      </div>

      <div className="md:grid-cols-2 grid gap-6">
        {data.map((item, index) => {
          const borderClassName =
            index == 0
              ? 'max-sm:border-b-1.5 md:border-r-1.5 border-purple-200'
              : '';

          return (
            <div
              key={item.id}
              className={`text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full w-full ${borderClassName}`}
            >
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                <ExternalLink href={item.source} hideArrow>
                  {!metrics || item.value === null ? '0.0%' : item.value}
                  <span className="text-2xl">↗</span>
                </ExternalLink>
              </span>
              <span className="block text-lg text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const BabydegenMetrics = () => {
  const { data: metrics } = usePersistentSWR('BabydegenMetrics', fetchMetrics, {
    refreshInterval: 10000, // refresh every 10s
    dedupingInterval: 5000,
  });

  return (
    <SectionWrapper id="stats">
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="flex flex-col gap-4">
          <MetricsBubble
            name="MODIUS"
            metrics={metrics?.modius}
            sourceUrl={MODIUS_HUGGINGFACE_URL}
          />
        </div>
        <div className="flex flex-col gap-4">
          <MetricsBubble
            name="OPTIMUS"
            metrics={metrics?.optimus}
            sourceUrl={OPTIMUS_HUGGINGFACE_URL}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
