import { useMemo } from 'react';

import { getBabydegenMetrics } from 'common-util/api';
import { OPERATE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsBubble } from 'components/MetricsBubble';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { Link } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';

const MODIUS_HUGGINGFACE_URL =
  'https://huggingface.co/spaces/valory/Modius-Agent-Performance';
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
        stakingAprCalculated:
          babydegenMetrics?.optimus?.stakingAprCalculated ?? null,
      },
      dailyActiveAgents: babydegenMetrics?.dailyActiveAgents || null,
    };
  } catch (error) {
    console.error('Error fetching average Aprs:', error);
    return { modius: null, optimus: null, dailyActiveAgents: null };
  }
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num.toFixed(1));
  return `${numTo1dp}%`;
};

const BabydegenMetricsBubble = ({
  isUnderConstruction = false,
  metrics,
  sourceUrl = OPERATE_URL,
  image,
  title,
}) => {
  const data = useMemo(() => {
    const baseMetrics = [
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
        value:
          metrics?.stakingAprCalculated !== null &&
          metrics?.stakingAprCalculated !== undefined
            ? formatNumber(metrics.stakingAprCalculated)
            : metrics?.maxOlasApr
              ? formatNumber(metrics.maxOlasApr)
              : null,
        source: {
          link: OPERATE_URL,
          isExternal: true,
        },
      },
    ];

    return baseMetrics;
  }, [metrics, sourceUrl]);

  return (
    <MetricsBubble
      isUnderConstruction={isUnderConstruction}
      metrics={data}
      image={image}
      title={title}
    />
  );
};

export const BabydegenMetrics = () => {
  const { data: metrics } = usePersistentSWR('BabydegenMetrics', fetchMetrics);

  return (
    <SectionWrapper id="stats">
      <div className="max-w-[872px] mx-auto grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-6 p-8 border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center md:col-span-2 w-full">
          <div className="flex items-center">
            <Image
              alt="Mech DAAs"
              src="/images/agents/babydegen-econ.png"
              width="35"
              height="35"
              className="mr-4"
            />
            BabyDegen Agent Economy
          </div>
          {metrics?.dailyActiveAgents ? (
            <Link
              className="font-extrabold text-6xl"
              href="/data#babydegen-daily-active-agents"
              hideArrow
            >
              {Math.floor(metrics?.dailyActiveAgents).toLocaleString()}
              <span className="text-4xl">↗</span>
            </Link>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex gap-2">
            Daily Active Agents (DAAs){' '}
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        <BabydegenMetricsBubble
          isUnderConstruction
          title="Modius Agent Economy"
          image="/images/babydegen-econ-page/modius.png"
          metrics={metrics?.modius}
          sourceUrl={MODIUS_HUGGINGFACE_URL}
        />
        <BabydegenMetricsBubble
          title="Optimus Agent Economy"
          image="/images/babydegen-econ-page/optimus.png"
          metrics={metrics?.optimus}
        />
      </div>
    </SectionWrapper>
  );
};
