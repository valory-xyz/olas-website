import { useMemo } from 'react';

import { OPERATE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsBubble } from 'components/MetricsBubble';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Link } from 'components/ui/typography';
import { isNil } from 'lodash';
import Image from 'next/image';

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num.toFixed(1));
  return `${numTo1dp}%`;
};

const BabydegenMetricsBubble = ({
  isUnderConstruction = false,
  metrics,
  status,
  sourceUrl = '/data#babydegen-metrics',
  image,
  title,
}) => {
  const data = useMemo(() => {
    const baseSource = sourceUrl
      ? { link: sourceUrl, isExternal: !sourceUrl.startsWith('/') }
      : undefined;
    const olasSource = sourceUrl?.startsWith('/')
      ? baseSource
      : { link: OPERATE_URL, isExternal: true };

    const baseMetrics = [
      {
        id: 'toUSDC',
        subText: 'APR, Relative to USDC - Moving Average 7D',
        value: metrics?.latestUsdcApr
          ? formatNumber(metrics.latestUsdcApr)
          : null,
        source: baseSource,
        status,
      },
      {
        id: 'toETH',
        subText: 'APR, Relative to ETH - Moving Average 7D',
        value: metrics?.latestEthApr
          ? formatNumber(metrics.latestEthApr)
          : null,
        source: baseSource,
        status,
      },
      {
        id: 'olasApr',
        subText: 'APR, OLAS - Via OLAS Staking',
        value: !isNil(metrics?.stakingAprCalculated)
          ? formatNumber(metrics.stakingAprCalculated)
          : metrics?.maxOlasApr
            ? formatNumber(metrics.maxOlasApr)
            : null,
        source: !isNil(metrics?.stakingAprCalculated) ? olasSource : undefined,
        status,
      },
    ];

    return baseMetrics;
  }, [metrics, sourceUrl, status]);

  return (
    <MetricsBubble
      isUnderConstruction={isUnderConstruction}
      metrics={data}
      image={image}
      title={title}
    />
  );
};

export const BabydegenMetrics = ({ metrics }) => {
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
          {metrics?.dailyActiveAgents?.value ? (
            <div className="flex items-center gap-2">
              <Link
                className="font-extrabold text-6xl"
                href="/data#babydegen-daily-active-agents"
                hideArrow
              >
                <span
                  className={
                    metrics.dailyActiveAgents.status?.stale
                      ? 'text-gray-400'
                      : ''
                  }
                >
                  {Math.floor(metrics.dailyActiveAgents.value).toLocaleString()}
                </span>
              </Link>
              <StaleIndicator status={metrics.dailyActiveAgents.status} />
            </div>
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
          metrics={metrics?.modius?.value}
          status={metrics?.modius?.status}
        />
        <BabydegenMetricsBubble
          title="Optimus Agent Economy"
          image="/images/babydegen-econ-page/optimus.png"
          metrics={metrics?.optimus?.value}
          status={metrics?.optimus?.status}
        />
      </div>
    </SectionWrapper>
  );
};
