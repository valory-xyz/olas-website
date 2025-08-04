import { useMemo } from 'react';

import { getBabydegenMetrics } from 'common-util/api';
import { OPERATE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsBubble } from 'components/MetricsBubble';
import { usePersistentSWR } from 'hooks';

const MODIUS_HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Modius-Agent-Performance';
const OPTIMUS_HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Optimus-Agent-Performance';

const fetchMetrics = async () => {
  try {
    const babydegenMetrics = await getBabydegenMetrics();

    return {
      modius: {
        latestAvgApr: babydegenMetrics?.modius?.latestAvgApr || null,
        latestEthApr: babydegenMetrics?.modius?.latestEthApr || null,
        maxOlasApr: babydegenMetrics?.modius?.maxOlasApr || null,
      },
      optimus: {
        latestAvgApr: babydegenMetrics?.optimus?.latestAvgApr || null,
        latestEthApr: babydegenMetrics?.optimus?.latestEthApr || null,
        maxOlasApr: babydegenMetrics?.optimus?.maxOlasApr || null,
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

const BabydegenMetricsBubble = ({ metrics, sourceUrl, image, title }) => {
  const data = useMemo(
    () => [
      {
        id: 'toUSDC',
        subText: 'APR, Relative to USDC - Moving Average 7D',
        value: metrics?.latestEthApr
          ? formatNumber(metrics.latestEthApr)
          : null,
        source: {
          link: sourceUrl,
          isExternal: true,
        },
      },
      {
        id: 'toETH',
        subText: 'APR, Relative to ETH - Moving Average 7D',
        value: metrics?.latestAvgApr
          ? formatNumber(metrics.latestAvgApr)
          : null,
        source: {
          link: sourceUrl,
          isExternal: true,
        },
      },
      {
        id: 'olasApr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: metrics?.maxOlasApr ? formatNumber(metrics.maxOlasApr) : null,
        source: {
          link: OPERATE_URL,
          isExternal: true,
        },
      },
    ],
    [metrics, sourceUrl],
  );

  return <MetricsBubble metrics={data} image={image} title={title} />;
};

export const BabydegenMetrics = () => {
  const { data: metrics } = usePersistentSWR('BabydegenMetrics', fetchMetrics);

  return (
    <SectionWrapper id="stats">
      <div className="max-w-[872px] mx-auto grid md:grid-cols-2 gap-6">
        <BabydegenMetricsBubble
          title="Modius Agent Economy"
          image="/images/babydegen-econ-page/modius.png"
          metrics={metrics?.modius}
          sourceUrl={MODIUS_HUGGINGFACE_URL}
        />
        <BabydegenMetricsBubble
          title="Optimus Agent Economy"
          image="/images/babydegen-econ-page/optimus.png"
          metrics={metrics?.optimus}
          sourceUrl={OPTIMUS_HUGGINGFACE_URL}
        />
      </div>
    </SectionWrapper>
  );
};
