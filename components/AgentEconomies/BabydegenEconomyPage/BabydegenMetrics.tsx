'use client';

import { useMemo, useState } from 'react';

import { OPERATE_URL } from 'common-util/constants';
import { ComingSoon } from 'components/ComingSoon';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Tabs } from 'components/ui/tabs';
import { ExternalLink, Link } from 'components/ui/typography';
import { isNil } from 'lodash';
import { LineChart } from 'lucide-react';
import Image from 'next/image';

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num.toFixed(1));
  return `${numTo1dp}%`;
};

const AprMetric = ({ item }) => {
  const value = item.value === null ? '--' : item.value;
  const display =
    item.source && value !== '--' ? (
      item.source.isExternal ? (
        <ExternalLink href={item.source.link} hideArrow>
          <span className={item.status?.stale ? 'text-gray-400' : ''}>{value}</span>
          <span className="text-2xl">↗</span>
        </ExternalLink>
      ) : (
        <Link href={item.source.link}>
          <span className={item.status?.stale ? 'text-gray-400' : ''}>{value}</span>
        </Link>
      )
    ) : (
      value
    );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-slate-700">{item.label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`text-2xl font-semibold ${item.status?.stale ? 'text-gray-400' : 'text-purple-600'}`}
        >
          {display}
        </span>
        <StaleIndicator status={item.status} />
      </div>
      <span className="text-xs text-slate-400">{item.hint}</span>
    </div>
  );
};

const BabydegenEconomyCard = ({
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

    return [
      {
        id: 'toUSDC',
        label: 'APR, Relative to USDC',
        hint: 'Moving Average 7D',
        value: metrics?.latestUsdcApr ? formatNumber(metrics.latestUsdcApr) : null,
        source: baseSource,
        status,
      },
      {
        id: 'toETH',
        label: 'APR, Relative to ETH',
        hint: 'Moving Average 7D',
        value: metrics?.latestEthApr ? formatNumber(metrics.latestEthApr) : null,
        source: baseSource,
        status,
      },
      {
        id: 'olasApr',
        label: 'APR, OLAS',
        hint: 'Via OLAS Staking',
        value: !isNil(metrics?.stakingAprCalculated)
          ? formatNumber(metrics.stakingAprCalculated)
          : metrics?.maxOlasApr
            ? formatNumber(metrics.maxOlasApr)
            : null,
        source: !isNil(metrics?.stakingAprCalculated) ? olasSource : undefined,
        status,
      },
    ];
  }, [metrics, sourceUrl, status]);

  return (
    <Card className="p-8 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {image && <Image alt={title} src={image} width={32} height={32} />}
          <span className="text-lg font-semibold">{title}</span>
        </div>
        {isUnderConstruction && (
          <Image
            src="/images/under-construction.svg"
            alt="Under Construction"
            width={163}
            height={28}
          />
        )}
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {data.map((item) => (
          <AprMetric key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
};

const ComingSoonCard = ({ name }) => (
  <Card className="p-8 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-4 min-h-[205px]">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
      <LineChart className="h-6 w-6 text-slate-400" />
    </div>
    <p className="text-base text-slate-500">{name} agent economy metrics are coming soon.</p>
  </Card>
);

const TAB_ITEMS = [
  { key: 'basius', label: 'Basius', icon: '/images/babydegen-econ-page/basius.png' },
  { key: 'optimus', label: 'Optimus', icon: '/images/babydegen-econ-page/optimus.png' },
  { key: 'modius', label: 'Modius', icon: '/images/babydegen-econ-page/modius.png' },
];

export const BabydegenMetrics = ({ metrics }) => {
  const [activeTab, setActiveTab] = useState('optimus');

  return (
    <SectionWrapper id="stats">
      <div className="max-w-[646px] mx-auto flex flex-col gap-6">
        <Card className="flex flex-col gap-6 p-8 border border-purple-200 rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center text-xl w-full">
          <div className="flex items-center">
            <Image
              alt="BabyDegen DAAs"
              src="/images/agents/babydegen-econ.png"
              width="35"
              height="35"
              className="mr-4"
            />
            BabyDegen Agent Economy
          </div>
          {metrics?.dailyActiveAgents?.value ? (
            <div className="flex items-center gap-2">
              <Link className="font-extrabold text-6xl" href="/data#babydegen-daily-active-agents">
                <span className={metrics.dailyActiveAgents.status?.stale ? 'text-gray-400' : ''}>
                  {Math.floor(metrics.dailyActiveAgents.value).toLocaleString()}
                </span>
              </Link>
              <StaleIndicator status={metrics.dailyActiveAgents.status} />
            </div>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex gap-2">
            Daily Active Agents (DAAs) <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>

        <Tabs items={TAB_ITEMS} activeKey={activeTab} onChange={setActiveTab} fullWidth />

        {activeTab === 'basius' && <ComingSoonCard name="Basius" />}
        {activeTab === 'optimus' && (
          <BabydegenEconomyCard
            isUnderConstruction
            title="Optimus Agent Economy"
            image="/images/babydegen-econ-page/optimus.png"
            metrics={metrics?.optimus?.value}
            status={metrics?.optimus?.status}
          />
        )}
        {activeTab === 'modius' && (
          <BabydegenEconomyCard
            isUnderConstruction
            title="Modius Agent Economy"
            image="/images/babydegen-econ-page/modius.png"
            metrics={metrics?.modius?.value}
            status={metrics?.modius?.status}
          />
        )}
      </div>
    </SectionWrapper>
  );
};
