'use client';

import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import {
  StaleIndicator,
  StaleIndicatorProps,
  StaleMetricContent,
  WarningIndicator,
} from 'components/ui/StaleIndicator';
import { Tabs } from 'components/ui/tabs';
import { Link } from 'components/ui/typography';
import type { WindowedMetric, WindowKey } from 'common-util/api/predict';
import { isNil } from 'lodash';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

export type Platform = 'polystrat' | 'omenstrat';

type MetricStatus = StaleIndicatorProps['status'];

export type PlatformMetrics = {
  // APR is a current staking rate (no time series) — the only un-windowed metric.
  apr: number | null;
  aprStatus: MetricStatus;
  // Windowed ROI: finalRoi = prediction + staking rewards; partialRoi = prediction only.
  partialRoi: WindowedMetric<number | null> | null;
  finalRoi: WindowedMetric<number | null> | null;
  // roiStatus tracks finalRoi (the headline); partialRoiStatus tracks the popover value,
  // which can be fresh while finalRoi is still stale (e.g. staking rewards backfilling).
  roiStatus: MetricStatus;
  partialRoiStatus: MetricStatus;
  // Windowed prediction accuracy (% correct per time range).
  successRate: WindowedMetric<number | null> | null;
  successRateStatus: MetricStatus;
  traderTxs: number | null;
  mechTxs: number | null;
  marketCreatorTxs?: number | null;
  txsStatus: MetricStatus;
  // Windowed mean Brier score (Omenstrat only today). Lower is better.
  brierScore?: WindowedMetric<number | null> | null;
  brierStatus?: MetricStatus;
};

type PlatformActivitySectionProps = {
  metrics: { polystrat: PlatformMetrics; omenstrat: PlatformMetrics };
  platform: Platform;
  onPlatformChange: (next: Platform) => void;
  className?: string;
};

const PLATFORM_TABS: Array<{ key: Platform; label: string; icon: string }> = [
  {
    key: 'omenstrat',
    label: 'Omenstrat',
    icon: '/images/predict-page/omenstrat-icon.png',
  },
  {
    key: 'polystrat',
    label: 'Polystrat',
    icon: '/images/predict-page/polystrat-icon.png',
  },
];

const TIME_RANGE_KEYS: { key: WindowKey; label: string }[] = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
  { key: 'max', label: 'Max' },
];

// ROI and Accuracy are windowed for both platforms; Brier adds a 4th windowed metric
// on Omenstrat. When no windowed data is available yet, the non-max tabs stay disabled.
const getTimeRangeTabs = (windowed: boolean) =>
  TIME_RANGE_KEYS.map(({ key, label }) =>
    windowed || key === 'max'
      ? { key, label }
      : { key, label, disabled: true, tooltip: 'Coming soon' }
  );

type MetricItemProps = {
  label: ReactNode;
  value: string | null;
  status?: MetricStatus;
  href?: string;
  warning?: ReactNode;
};

const MetricItem = ({ label, value, status, href, warning }: MetricItemProps) => {
  // Match the brand colour of the linked metrics (Link is text-purple-600) so an
  // unlinked value (e.g. Brier, which has no /data anchor yet) looks consistent.
  const valueClass = `text-2xl font-bold ${status?.stale ? 'text-gray-400' : 'text-purple-600'}`;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="flex items-center gap-2">
        {href ? (
          <Link href={href} className="text-2xl font-bold">
            <span className={status?.stale ? 'text-gray-400' : ''}>{value || '--'}</span>
          </Link>
        ) : (
          <span className={valueClass}>{value || '--'}</span>
        )}
        {warning ? (
          <WarningIndicator>{warning}</WarningIndicator>
        ) : (
          <StaleIndicator status={status} />
        )}
      </div>
    </div>
  );
};

const PlatformSwitcher = ({
  platform,
  onChange,
}: {
  platform: Platform;
  onChange: (next: Platform) => void;
}) => (
  <div className="flex items-stretch gap-1 bg-white border border-slate-200 rounded-xl p-1">
    {PLATFORM_TABS.map(({ key, label, icon }) => {
      const isActive = platform === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex-1 flex items-center justify-center gap-3 px-10 py-1.5 rounded-lg text-base font-normal transition-colors ${
            isActive ? 'bg-slate-200 text-gray-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Image src={icon} alt="" width={28} height={28} />
          <span>
            {label}
            <span className="hidden sm:inline"> Agent Economy</span>
          </span>
        </button>
      );
    })}
  </div>
);

export const PlatformActivitySection = ({
  metrics,
  platform,
  onPlatformChange,
  className,
}: PlatformActivitySectionProps) => {
  const m = metrics[platform];

  // ROI, Accuracy (both platforms) and Brier (Omenstrat) are windowed, so tabs are
  // enabled whenever windowed data exists.
  const isWindowed = !isNil(m.successRate) || !isNil(m.finalRoi);
  const [activeWindow, setActiveWindow] = useState<WindowKey>('max');

  const finalRoiValue = m.finalRoi?.[activeWindow] ?? null;
  const partialRoiValue = m.partialRoi?.[activeWindow] ?? null;
  const roiItem: MetricItemProps = {
    label: (
      <span className="flex items-center gap-2">
        Total ROI - Average{' '}
        {!isNil(partialRoiValue) && (
          <Popover>
            <div className="flex flex-col max-w-[320px] gap-4 text-base">
              <p className="text-gray-500">
                Total ROI shows your agent&apos;s overall earnings, including profits from
                predictions and staking rewards, minus all related costs.
              </p>
              <p className="text-gray-500">
                Partial ROI reflects only prediction performance, excluding staking rewards.
              </p>
              <div className="flex justify-between">
                <span className="text-gray-900">Partial ROI</span>
                <span className={m.partialRoiStatus?.stale ? 'text-gray-400' : ''}>
                  {`${Math.round(partialRoiValue)}%`}
                </span>
              </div>
              <div className="text-sm">
                <StaleMetricContent status={m.partialRoiStatus} />
              </div>
            </div>
          </Popover>
        )}
      </span>
    ),
    value: isNil(finalRoiValue) ? null : `${Math.round(finalRoiValue)}%`,
    status: m.roiStatus,
    href: `/data#${platform}-predict-roi`,
    warning:
      platform === 'polystrat' ? (
        <p>Due to recent updates on Polymarket this metric temporarily shows incorrect values</p>
      ) : undefined,
  };

  const accuracyValue = m.successRate?.[activeWindow] ?? null;
  const accuracyItem: MetricItemProps = {
    label: (
      <span className="flex items-center gap-2">
        Prediction Accuracy{' '}
        <Popover>
          <div className="flex flex-col max-w-[320px] gap-2 text-base text-gray-500">
            <p>
              Share of the agent&apos;s settled predictions that were correct, over the selected
              time range. Each bet is counted on the day it was placed, once its market has
              resolved.
            </p>
          </div>
        </Popover>
      </span>
    ),
    value: isNil(accuracyValue) ? null : `${accuracyValue.toFixed(0)}%`,
    status: m.successRateStatus,
    href: `/data#${platform}-predict-accuracy`,
  };

  const aprItem: MetricItemProps = {
    label: 'OLAS Staking APR',
    value: isNil(m.apr) ? null : `${m.apr}%`,
    status: m.aprStatus,
    href: `/data#${platform}-predict-apr`,
  };

  const brierValue = m.brierScore?.[activeWindow] ?? null;
  const brierItem: MetricItemProps = {
    label: (
      <span className="flex items-center gap-2">
        Brier Score{' '}
        <Popover>
          <div className="flex flex-col max-w-[320px] gap-2 text-base text-gray-500">
            <p>
              The Brier score measures how well-calibrated the agent&apos;s predictions are.{' '}
              <span className="text-gray-900">Lower is better</span> — 0 is a perfect forecast,
              ~0.25 is no better than a 50/50 guess, and 1 is maximally wrong.
            </p>
          </div>
        </Popover>
      </span>
    ),
    value: isNil(brierValue) ? null : brierValue.toFixed(2),
    status: m.brierStatus,
    href: `/data#${platform}-predict-brier`,
  };

  // ROI, Accuracy and Brier (Omenstrat only) respond to the time-range tabs. APR is a
  // current staking rate with no per-window data, so it simply stays constant as the
  // tabs change. Brier is a 4th metric on Omenstrat only (predict-polymarket doesn't
  // index Brier yet).
  const performanceItems: MetricItemProps[] = [
    roiItem,
    aprItem,
    accuracyItem,
    ...(platform === 'omenstrat' ? [brierItem] : []),
  ];

  const lifetimeItems: MetricItemProps[] = [
    {
      label: 'Traders',
      value: isNil(m.traderTxs) ? null : m.traderTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
    },
    {
      label: 'Mechs: Prediction Brokers',
      value: isNil(m.mechTxs) ? null : m.mechTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
    },
  ];

  if (m.marketCreatorTxs !== undefined) {
    lifetimeItems.push({
      label: 'Market Creators & Closers',
      value: isNil(m.marketCreatorTxs) ? null : m.marketCreatorTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
    });
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`}>
      <PlatformSwitcher platform={platform} onChange={onPlatformChange} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-lg font-semibold">Performance</div>
            <Tabs
              items={getTimeRangeTabs(isWindowed)}
              activeKey={isWindowed ? activeWindow : 'max'}
              onChange={(key) => setActiveWindow(key as WindowKey)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {performanceItems.map((item, i) => (
              <MetricItem key={i} {...item} />
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col gap-6">
          <div className="text-lg font-semibold">Transactions by Agent Type</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {lifetimeItems.map((item, i) => (
              <MetricItem key={i} {...item} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
