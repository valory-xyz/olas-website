import Image from 'next/image';
import { useMemo } from 'react';

import { getAverageAprs, getBabydegenOlasApr } from 'common-util/api';
import { OPERATE_URL } from 'common-util/constants';
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
    const [averageAprsResult, maxOlasAprsResult] = await Promise.allSettled([
      getAverageAprs(),
      getBabydegenOlasApr(),
    ]);

    const averageAprs =
      averageAprsResult.status === 'fulfilled' ? averageAprsResult.value : null;
    const maxOlasAprs =
      maxOlasAprsResult.status === 'fulfilled' ? maxOlasAprsResult.value : null;

    return {
      modius: {
        latestAvgApr: averageAprs?.modius?.latestAvgApr || null,
        latestEthApr: averageAprs?.modius?.latestEthApr || null,
        maxOlasApr: maxOlasAprs?.modius || null,
      },
      optimus: {
        latestAvgApr: averageAprs?.optimus?.latestAvgApr || null,
        latestEthApr: averageAprs?.optimus?.latestEthApr || null,
        maxOlasApr: maxOlasAprs?.optimus || null,
      },
    };
  } catch (error) {
    console.error('Error fetching average Aprs:', error);
    return { modius: null, optimus: null };
  }
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num.toFixed(1));
  return `${numTo1dp}%`;
};

const MetricsBubble = ({ metrics, sourceUrl, image, title }) => {
  const data = useMemo(
    () => [
      {
        id: 'toUSDC',
        subText: 'APR, Relative to USDC - Moving Average 7D',
        value: metrics?.latestEthApr
          ? formatNumber(metrics.latestEthApr)
          : null,
        source: sourceUrl,
      },
      {
        id: 'toETH',
        subText: 'APR, Relative to ETH - Moving Average 7D',
        value: metrics?.latestAvgApr
          ? formatNumber(metrics.latestAvgApr)
          : null,
        source: sourceUrl,
      },
      {
        id: 'olasApr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: metrics?.maxOlasApr ? formatNumber(metrics.maxOlasApr) : null,
        source: OPERATE_URL,
      },
    ],
    [metrics, sourceUrl],
  );

  return (
    <Card className="p-8 border border-slate-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] items-center">
      <Image alt={title} src={image} width="48" height="48" className="mb-4" />
      <div className="text-lg font-medium mb-6">{title}</div>

      <div className="flex flex-col gap-8">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col gap-3">
            <span className="block text-base text-slate-700">
              {item.subText}
            </span>
            <span className="block text-2xl font-semibold text-purple-600">
              <ExternalLink href={item.source} hideArrow>
                {!metrics || item.value === null ? '0.0%' : item.value}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const BabydegenMetrics = () => {
  const { data: metrics } = usePersistentSWR('BabydegenMetrics', fetchMetrics);

  return (
    <SectionWrapper id="stats">
      <div className="flex flex-wrap gap-6 justify-center">
        <MetricsBubble
          title="Modius Agent Economy"
          image="/images/babydegen-econ-page/modius.png"
          metrics={metrics?.modius}
          sourceUrl={MODIUS_HUGGINGFACE_URL}
        />
        <MetricsBubble
          title="Optimus Agent Economy"
          image="/images/babydegen-econ-page/optimus.png"
          metrics={metrics?.optimus}
          sourceUrl={OPTIMUS_HUGGINGFACE_URL}
        />
      </div>
    </SectionWrapper>
  );
};
