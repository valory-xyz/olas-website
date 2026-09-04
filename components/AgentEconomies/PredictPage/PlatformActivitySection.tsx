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
import { MetricContext } from 'components/ui/MetricContext';
import type { WindowedMetric, WindowKey } from 'common-util/api/predict';
import { isNil } from 'lodash';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { isFrozen } from 'common-util/graphql/metric-utils';

export type Platform = 'polystrat' | 'omenstrat';

type MetricStatus = StaleIndicatorProps['status'];

export type PlatformMetrics = {
  // Windowed max OLAS staking APR across the contracts nominated within each range.
  apr: WindowedMetric<number | null> | null;
  aprStatus: MetricStatus;
  // Windowed ROI: partialRoi (trading, prediction-only) is the headline; finalRoi
  // (total, incl. staking rewards) shows in the popover.
  partialRoi: WindowedMetric<number | null> | null;
  finalRoi: WindowedMetric<number | null> | null;
  // roiStatus tracks finalRoi (the popover value), which can be stale while the
  // headline is fresh (e.g. staking rewards backfilling); partialRoiStatus tracks
  // the headline.
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
  /** Fallback as-of timestamp for metrics whose source is lagging. */
  snapshotTimestamp?: number | null;
  /** Rendered between the switcher and the metric cards, so it follows the platform. */
  beforeMetrics?: ReactNode;
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

// A windowed metric only carries data once at least one of its windows is non-null.
// On a fresh predict blob mid-backfill every window is null, so this stays false and
// the non-max tabs remain disabled (matching getTimeRangeTabs below).
const hasWindowData = (w?: WindowedMetric<number | null> | null): boolean =>
  !isNil(w) && Object.values(w).some((v) => !isNil(v));

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
  /** Plain-text form of `label`, echoed into the hidden sentence so the two can't drift. */
  labelText?: string;
  value: string | null;
  status?: MetricStatus;
  href?: string;
  warning?: ReactNode;
  /**
   * Machine-readable context. Essential here: the selected time range is React state
   * expressed only as a highlighted tab, so a bare "69%" carries no window at all in
   * the text layer, and the tab labels serialise as the single token "7D30D90DMax".
   */
  context?: { noun: string; scope?: string; window?: string };
  asOfFallback?: number | null;
};

/** The window as prose, for the machine-readable sentence. */
const WINDOW_PHRASE: Record<WindowKey, string> = {
  '7d': 'over the last 7 days',
  '30d': 'over the last 30 days',
  '90d': 'over the last 90 days',
  max: 'over all time',
};

/** Short form, for phrasings where the descriptive clause would not fit grammatically. */
const PLATFORM_NAME: Record<Platform, string> = {
  omenstrat: 'Omenstrat',
  polystrat: 'Polystrat',
};

const PLATFORM_PHRASE: Record<Platform, string> = {
  omenstrat: 'Omenstrat agents trading Omen prediction markets on Gnosis',
  polystrat: 'Polystrat agents trading Polymarket prediction markets on Polygon',
};

const MetricItem = ({
  label,
  labelText,
  value,
  status,
  href,
  warning,
  context,
  asOfFallback,
}: MetricItemProps) => {
  // Match the brand colour of the linked metrics (Link is text-purple-600) so an
  // unlinked value (e.g. Brier, which has no /data anchor yet) looks consistent.
  const valueClass = `text-2xl font-bold ${isFrozen(status) ? 'text-gray-400' : 'text-purple-600'}`;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="flex items-center gap-2">
        {href ? (
          <Link href={href} className="text-2xl font-bold">
            <span className={isFrozen(status) ? 'text-gray-400' : ''}>{value || '--'}</span>
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
      {context && (
        <MetricContext
          label={labelText}
          value={value}
          status={status}
          asOfFallback={asOfFallback}
          {...context}
        />
      )}
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
          aria-pressed={isActive}
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
  snapshotTimestamp = null,
  beforeMetrics = null,
}: PlatformActivitySectionProps) => {
  const m = metrics[platform];

  // Tabs are enabled once any windowed metric has at least one non-null window (not
  // merely a present-but-all-null object from a mid-backfill blob).
  const isWindowed =
    hasWindowData(m.partialRoi) ||
    hasWindowData(m.finalRoi) ||
    hasWindowData(m.successRate) ||
    hasWindowData(m.apr) ||
    hasWindowData(m.brierScore);
  const [activeWindow, setActiveWindow] = useState<WindowKey>('7d');

  // The tab strip is forced to `max` when no windowed data exists, so the effective
  // window — not `activeWindow` — is what the values actually represent.
  const effectiveWindow: WindowKey = isWindowed ? activeWindow : 'max';
  const windowPhrase = WINDOW_PHRASE[effectiveWindow];
  const platformPhrase = PLATFORM_PHRASE[platform];
  const platformName = PLATFORM_NAME[platform];

  const tradingRoiValue = m.partialRoi?.[activeWindow] ?? null;
  const totalRoiValue = m.finalRoi?.[activeWindow] ?? null;
  const roiItem: MetricItemProps = {
    label: (
      <span className="flex items-center gap-2">
        Trading ROI - Average{' '}
        {!isNil(totalRoiValue) && (
          <Popover>
            <div className="flex flex-col max-w-[320px] gap-4 text-base">
              <p className="text-gray-500">
                Trading ROI reflects only prediction performance, excluding staking rewards.
              </p>
              <p className="text-gray-500">
                Total ROI shows your agent&apos;s overall earnings, including profits from
                predictions and staking rewards, minus all related costs.
              </p>
              <div className="flex justify-between">
                <span className="text-gray-900">Total ROI</span>
                <span className={isFrozen(m.roiStatus) ? 'text-gray-400' : ''}>
                  {`${Math.round(totalRoiValue)}%`}
                </span>
              </div>
              <div className="text-sm">
                <StaleMetricContent status={m.roiStatus} />
              </div>
            </div>
          </Popover>
        )}
      </span>
    ),
    labelText: 'Trading ROI - Average',
    value: isNil(tradingRoiValue) ? null : `${Math.round(tradingRoiValue)}%`,
    status: m.partialRoiStatus,
    href: `/data#${platform}-predict-roi`,
    context: {
      noun: `average trading return on investment for ${platformPhrase}, from prediction performance only and excluding staking rewards`,
      window: windowPhrase,
    },
    asOfFallback: snapshotTimestamp,
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
    labelText: 'Prediction Accuracy',
    value: isNil(accuracyValue) ? null : `${accuracyValue.toFixed(0)}%`,
    status: m.successRateStatus,
    href: `/data#${platform}-predict-accuracy`,
    context: {
      noun: `prediction accuracy — the share of settled predictions that were correct — for ${platformPhrase}. Each bet is counted on the day it was placed, once its market has resolved, so the window selects when bets were placed rather than when markets settled`,
      window: windowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  const aprValue = m.apr?.[activeWindow] ?? null;
  const aprItem: MetricItemProps = {
    label: 'OLAS Staking APR',
    labelText: 'OLAS Staking APR',
    value: isNil(aprValue) ? null : `${aprValue}%`,
    status: m.aprStatus,
    href: `/data#${platform}-predict-apr`,
    context: {
      // `m.apr` became a WindowedMetric upstream, so this does follow the tabs: it is
      // the maximum rate among contracts nominated during the selected window.
      noun: `maximum OLAS staking annual percentage rate among contracts nominated for ${platformPhrase}`,
      window: windowPhrase,
    },
    asOfFallback: snapshotTimestamp,
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
    labelText: 'Brier Score',
    value: isNil(brierValue) ? null : brierValue.toFixed(2),
    status: m.brierStatus,
    href: `/data#${platform}-predict-brier`,
    context: {
      noun: `mean Brier score for ${platformPhrase}, measuring forecast calibration where lower is better — 0 is a perfect forecast, about 0.25 is no better than a coin flip, and 1 is maximally wrong`,
      window: windowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  // All performance metrics respond to the time-range tabs. Brier is a 4th metric on
  // Omenstrat only (predict-polymarket doesn't index Brier yet).
  const performanceItems: MetricItemProps[] = [
    roiItem,
    aprItem,
    accuracyItem,
    ...(platform === 'omenstrat' ? [brierItem] : []),
  ];

  // These are lifetime counts and do not follow the time-range tabs, so each says
  // "all time" explicitly rather than inheriting the selected window by proximity.
  const lifetimeItems: MetricItemProps[] = [
    {
      label: 'Traders',
      labelText: 'Traders',
      value: isNil(m.traderTxs) ? null : m.traderTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
      context: {
        noun: `transactions by trader agents on ${platformName}, a subset of total ${platformName} transactions`,
        window: 'all time',
      },
      asOfFallback: snapshotTimestamp,
    },
    {
      label: 'Mechs: Prediction Brokers',
      labelText: 'Mechs: Prediction Brokers',
      value: isNil(m.mechTxs) ? null : m.mechTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
      context: {
        noun: `transactions by mech agents acting as prediction brokers on ${platformName}, a subset of total ${platformName} transactions`,
        window: 'all time',
      },
      asOfFallback: snapshotTimestamp,
    },
  ];

  if (m.marketCreatorTxs !== undefined) {
    lifetimeItems.push({
      label: 'Market Creators & Closers',
      labelText: 'Market Creators & Closers',
      value: isNil(m.marketCreatorTxs) ? null : m.marketCreatorTxs.toLocaleString(),
      status: m.txsStatus,
      href: `/data#${platform}-predict-transactions-by-type`,
      context: {
        noun: `transactions by market creator and closer agents on ${platformName}, a subset of total ${platformName} transactions`,
        window: 'all time',
      },
      asOfFallback: snapshotTimestamp,
    });
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`}>
      <PlatformSwitcher platform={platform} onChange={onPlatformChange} />

      {beforeMetrics}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200 rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-lg font-semibold">Performance</div>
            <Tabs
              ariaLabel="Performance time range"
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
