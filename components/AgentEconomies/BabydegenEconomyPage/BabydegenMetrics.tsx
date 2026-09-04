'use client';

import { useMemo, useState } from 'react';

import { OPERATE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { Tabs } from 'components/ui/tabs';
import { ExternalLink, Link } from 'components/ui/typography';
import { isNil } from 'lodash';
import Image from 'next/image';
import NextLink from 'next/link';
import { isFrozen } from 'common-util/graphql/metric-utils';
import { MetricContext, buildMetricContext } from 'components/ui/MetricContext';

const formatNumber = (num) => {
  if (num === null || num === undefined) return null;
  const numTo1dp = Number(num.toFixed(1));
  return `${numTo1dp}%`;
};

const AprMetric = ({ item, economyName, snapshotTimestamp }) => {
  const value = item.value === null ? '--' : item.value;
  const display =
    item.source && value !== '--' ? (
      item.source.isExternal ? (
        <ExternalLink href={item.source.link} hideArrow>
          <span className={isFrozen(item.status) ? 'text-gray-400' : ''}>{value}</span>
          <span className="text-2xl">↗</span>
        </ExternalLink>
      ) : (
        <Link href={item.source.link}>
          <span className={isFrozen(item.status) ? 'text-gray-400' : ''}>{value}</span>
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
          className={`text-2xl font-semibold ${isFrozen(item.status) ? 'text-gray-400' : 'text-purple-600'}`}
        >
          {display}
        </span>
        <StaleIndicator status={item.status} />
      </div>
      <span className="text-xs text-slate-400">{item.hint}</span>
      <MetricContext
        label={item.label}
        value={item.value}
        status={item.status}
        asOfFallback={snapshotTimestamp}
        noun={`${item.contextNoun} for ${economyName}`}
        window={item.contextWindow}
      />
    </div>
  );
};

/**
 * The three APR figures a BabyDegen economy publishes.
 *
 * Lifted out of the card so the hidden mirror of the inactive tabs is generated from the
 * same source as the visible one — otherwise the two descriptions of the same number
 * drift apart the moment either is edited.
 */
const buildAprItems = (metrics, sourceUrl, status) => {
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
      contextNoun: 'annual percentage rate measured relative to holding USDC',
      contextWindow: '7-day moving average',
      value: metrics?.latestUsdcApr ? formatNumber(metrics.latestUsdcApr) : null,
      source: baseSource,
      status,
    },
    {
      id: 'toETH',
      label: 'APR, Relative to ETH',
      hint: 'Moving Average 7D',
      contextNoun: 'annual percentage rate measured relative to holding ETH',
      contextWindow: '7-day moving average',
      value: metrics?.latestEthApr ? formatNumber(metrics.latestEthApr) : null,
      source: baseSource,
      status,
    },
    {
      id: 'olasApr',
      label: 'APR, OLAS',
      hint: 'Via OLAS Staking',
      contextNoun: 'annual percentage rate earned via OLAS staking',
      contextWindow: 'a current rate',
      value: !isNil(metrics?.stakingAprCalculated)
        ? formatNumber(metrics.stakingAprCalculated)
        : metrics?.maxOlasApr
          ? formatNumber(metrics.maxOlasApr)
          : null,
      source: !isNil(metrics?.stakingAprCalculated) ? olasSource : undefined,
      status,
    },
  ];
};

const BabydegenEconomyCard = ({
  isUnderConstruction = false,
  metrics,
  status,
  sourceUrl = '/data#babydegen-metrics',
  image,
  title,
  economyName,
  snapshotTimestamp = null,
}) => {
  const data = useMemo(
    () => buildAprItems(metrics, sourceUrl, status),
    [metrics, sourceUrl, status]
  );

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
          <AprMetric
            key={item.id}
            item={item}
            economyName={economyName}
            snapshotTimestamp={snapshotTimestamp}
          />
        ))}
      </div>
    </Card>
  );
};

/**
 * The three BabyDegen economies, described once.
 *
 * The tab switcher swaps whole cards, so only one economy's numbers reach the served
 * HTML; the other two exist solely in React state. Both the visible card and the hidden
 * mirror below are built from this list.
 */
const ECONOMIES = [
  {
    key: 'basius',
    tabLabel: 'Basius',
    title: 'Basius Agent Economy',
    image: '/images/babydegen-econ-page/basius.png',
    economyName: 'the Basius agent economy',
  },
  {
    key: 'optimus',
    tabLabel: 'Optimus',
    title: 'Optimus Agent Economy',
    image: '/images/babydegen-econ-page/optimus.png',
    economyName: 'the Optimus agent economy',
    isUnderConstruction: true,
  },
  {
    key: 'modius',
    tabLabel: 'Modius',
    title: 'Modius Agent Economy',
    image: '/images/babydegen-econ-page/modius.png',
    economyName: 'the Modius agent economy',
    isUnderConstruction: true,
  },
];

/**
 * The economies behind the other two tabs.
 *
 * `aria-hidden` because this duplicates for machines what a screen-reader user already
 * has: the active card is fully described above, and they can switch tabs to reach the
 * others. Crawlers read the DOM's text regardless.
 */
const HiddenEconomies = ({ metrics, activeTab, snapshotTimestamp }) => (
  <div className="sr-only" aria-hidden="true">
    {ECONOMIES.filter(({ key }) => key !== activeTab).map(({ key, title, economyName }) => {
      const rows = buildAprItems(
        metrics?.[key]?.value,
        '/data#babydegen-metrics',
        metrics?.[key]?.status
      )
        .map((item) => ({
          label: item.label,
          sentence: buildMetricContext({
            value: item.value,
            noun: `${item.contextNoun} for ${economyName}`,
            label: item.label,
            window: item.contextWindow,
            status: item.status,
            asOfFallback: snapshotTimestamp,
          }),
        }))
        .filter((row) => row.sentence);

      if (rows.length === 0) return null;

      return (
        <table key={key}>
          {/* Named per economy: retrieved on its own, "the selected economy" says nothing. */}
          <caption>{`${title} — annual percentage rates.`}</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{`${row.label} (${title})`}</th>
                <td>{row.sentence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    })}
  </div>
);

// Derived, so the tab strip and the cards below can't list different economies.
const TAB_ITEMS = ECONOMIES.map(({ key, tabLabel, image }) => ({
  key,
  label: tabLabel,
  icon: image,
}));

export const BabydegenMetrics = ({ metrics, snapshotTimestamp = null }) => {
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
                <span className={isFrozen(metrics.dailyActiveAgents.status) ? 'text-gray-400' : ''}>
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
          <MetricContext
            label="Daily Active Agents (DAAs)"
            value={
              metrics?.dailyActiveAgents?.value ? Math.floor(metrics.dailyActiveAgents.value) : null
            }
            status={metrics?.dailyActiveAgents?.status}
            asOfFallback={snapshotTimestamp}
            noun="daily active BabyDegen agents, measured as unique multisigs active each day"
            window="7-day average"
          />
        </Card>

        <Tabs
          ariaLabel="BabyDegen agent economy"
          items={TAB_ITEMS}
          activeKey={activeTab}
          onChange={setActiveTab}
          fullWidth
        />

        {/* Announces the swap: the tab strip serialises as one token and the card
            below changes wholesale, so without this nothing signals the change. */}
        <p className="sr-only" role="status">
          {`Showing the ${ECONOMIES.find(({ key }) => key === activeTab)?.title}.`}
        </p>

        {ECONOMIES.filter(({ key }) => key === activeTab).map(
          ({ key, title, image, economyName, isUnderConstruction }) => (
            <BabydegenEconomyCard
              key={key}
              isUnderConstruction={isUnderConstruction}
              title={title}
              image={image}
              metrics={metrics?.[key]?.value}
              status={metrics?.[key]?.status}
              economyName={economyName}
              snapshotTimestamp={snapshotTimestamp}
            />
          )
        )}

        <HiddenEconomies
          metrics={metrics}
          activeTab={activeTab}
          snapshotTimestamp={snapshotTimestamp}
        />

        <div className="mt-8 flex justify-center">
          <Button variant="default" size="lg" asChild>
            <NextLink href="/agent-economies/explorer?economy=babydegen">
              View BabyDegen Economy in Explorer
            </NextLink>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};
