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
import { MetricContext, buildMetricContext } from 'components/ui/MetricContext';
import type { WindowedMetric, WindowKey } from 'common-util/api/predict';
import { PLATFORM_NAME, PLATFORM_PHRASE, PREDICT_WINDOWS, windowPhrase } from './constants';
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

// A windowed metric only carries data once at least one of its windows is non-null.
// On a fresh predict blob mid-backfill every window is null, so this stays false and
// the non-max tabs remain disabled (matching getTimeRangeTabs below).
const hasWindowData = (w?: WindowedMetric<number | null> | null): boolean =>
  !isNil(w) && Object.values(w).some((v) => !isNil(v));

// ROI and Accuracy are windowed for both platforms; Brier adds a 4th windowed metric
// on Omenstrat. When no windowed data is available yet, the non-max tabs stay disabled.
const getTimeRangeTabs = (windowed: boolean) =>
  PREDICT_WINDOWS.map(({ key, label }) =>
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

/**
 * The windowed performance metrics, described once as data.
 *
 * Both the visible tiles and the hidden all-states table below read from this list, so
 * the same number cannot be labelled or explained two different ways depending on which
 * of the eight platform x window combinations you land on.
 */
type PerformanceMetric = {
  labelText: string;
  read: (m: PlatformMetrics, window: WindowKey) => number | null | undefined;
  readStatus: (m: PlatformMetrics) => MetricStatus;
  format: (value: number) => string;
  noun: (platformPhrase: string) => string;
  anchor: string;
  /** Restricts a metric to the platforms whose source actually indexes it. */
  platforms?: Platform[];
};

const PERFORMANCE_METRICS = {
  tradingRoi: {
    labelText: 'Trading ROI - Average',
    read: (m, window) => m.partialRoi?.[window],
    readStatus: (m) => m.partialRoiStatus,
    format: (value) => `${Math.round(value)}%`,
    noun: (platformPhrase) =>
      `average trading return on investment for ${platformPhrase}, from prediction performance only and excluding staking rewards`,
    anchor: 'predict-roi',
  },
  apr: {
    labelText: 'OLAS Staking APR',
    read: (m, window) => m.apr?.[window],
    readStatus: (m) => m.aprStatus,
    format: (value) => `${value}%`,
    // `m.apr` became a WindowedMetric upstream, so this does follow the tabs: it is
    // the maximum rate among contracts nominated during the selected window.
    noun: (platformPhrase) =>
      `maximum OLAS staking annual percentage rate among the staking contracts for ${platformPhrase} that were nominated at any point in the window`,
    anchor: 'predict-apr',
  },
  accuracy: {
    labelText: 'Prediction Accuracy',
    read: (m, window) => m.successRate?.[window],
    readStatus: (m) => m.successRateStatus,
    format: (value) => `${value.toFixed(0)}%`,
    noun: (platformPhrase) =>
      `prediction accuracy — the share of settled predictions that were correct — for ${platformPhrase}. Each bet is counted on the day it was placed, once its market has resolved, so the window selects when bets were placed rather than when markets settled`,
    anchor: 'predict-accuracy',
  },
  brier: {
    labelText: 'Brier Score',
    read: (m, window) => m.brierScore?.[window],
    readStatus: (m) => m.brierStatus,
    format: (value) => value.toFixed(2),
    noun: (platformPhrase) =>
      `mean Brier score for ${platformPhrase}, measuring forecast calibration where lower is better — 0 is a perfect forecast, about 0.25 is no better than a coin flip, and 1 is maximally wrong`,
    anchor: 'predict-brier',
    // predict-polymarket doesn't index Brier yet.
    platforms: ['omenstrat'],
  },
} satisfies Record<string, PerformanceMetric>;

/** Visible order of the performance tiles, and of the rows in the hidden table. */
const PERFORMANCE_ORDER = ['tradingRoi', 'apr', 'accuracy', 'brier'] as const;

/** Lifetime counts. These ignore the time-range tabs, but not the platform switcher. */
const LIFETIME_METRICS: Array<{
  labelText: string;
  read: (m: PlatformMetrics) => number | null | undefined;
  noun: (platformName: string) => string;
}> = [
  {
    labelText: 'Traders',
    read: (m) => m.traderTxs,
    noun: (platformName) =>
      `transactions by trader agents on ${platformName}, a subset of total ${platformName} transactions`,
  },
  {
    labelText: 'Mechs: Prediction Brokers',
    read: (m) => m.mechTxs,
    noun: (platformName) =>
      `transactions by mech agents acting as prediction brokers on ${platformName}, a subset of total ${platformName} transactions`,
  },
  {
    labelText: 'Market Creators & Closers',
    read: (m) => m.marketCreatorTxs,
    noun: (platformName) =>
      `transactions by market creator and closer agents on ${platformName}, a subset of total ${platformName} transactions`,
  },
];

const appliesTo = (metric: PerformanceMetric, platform: Platform) =>
  !metric.platforms || metric.platforms.includes(platform);

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

/**
 * Every platform x window combination, as tables.
 *
 * The switcher and the time-range tabs are React state expressed only as a highlighted
 * button, and the tab strip itself serialises as the single token "7D30D90DMax". A crawler
 * fetching this page once therefore sees one of eight states and no sign that the other
 * seven exist — so all eight are written out here.
 *
 * `aria-hidden` because this is a duplicate for machines: the visible tiles already carry
 * the active state for a screen-reader user, who can switch to any other. Making them page
 * through eight redundant tables would be a regression, and crawlers read the DOM's text
 * either way.
 */
const AllStatesTables = ({
  metrics,
  activePlatform,
  activeWindow,
  snapshotTimestamp,
}: {
  metrics: { polystrat: PlatformMetrics; omenstrat: PlatformMetrics };
  activePlatform: Platform;
  activeWindow: WindowKey;
  snapshotTimestamp: number | null;
}) => (
  <div className="sr-only" aria-hidden="true">
    {PLATFORM_TABS.map(({ key: platform }) => {
      const m = metrics[platform];
      const platformPhrase = PLATFORM_PHRASE[platform];
      const platformName = PLATFORM_NAME[platform];

      return PREDICT_WINDOWS.map(({ key: window }) => {
        // The state already on screen; it is described by the visible tiles.
        if (platform === activePlatform && window === activeWindow) return null;

        const rows = PERFORMANCE_ORDER.map((key) => PERFORMANCE_METRICS[key])
          .filter((metric) => appliesTo(metric, platform))
          .map((metric) => {
            const value = metric.read(m, window);
            const sentence = buildMetricContext({
              value: isNil(value) ? null : metric.format(value),
              noun: metric.noun(platformPhrase),
              label: metric.labelText,
              window: windowPhrase(window),
              status: metric.readStatus(m),
              asOfFallback: snapshotTimestamp,
            });
            return sentence ? { labelText: metric.labelText, sentence } : null;
          })
          .filter(Boolean);

        if (rows.length === 0) return null;

        return (
          <table key={`${platform}-${window}`}>
            {/* The caption names its own platform and window: these tables are retrieved
                one at a time, so "the selected range" would say nothing. */}
            <caption>
              {`${platformName} prediction agent performance ${windowPhrase(window)}.`}
            </caption>
            <tbody>
              {rows.map((row) => (
                <tr key={row.labelText}>
                  <th scope="row">{`${row.labelText} (${platformName}, ${windowPhrase(window)})`}</th>
                  <td>{row.sentence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      });
    })}

    {/* Lifetime counts ignore the window but not the switcher, so only the platform that
        is not on screen is missing from the text layer. */}
    {PLATFORM_TABS.filter(({ key }) => key !== activePlatform).map(({ key: platform }) => {
      const m = metrics[platform];
      const platformName = PLATFORM_NAME[platform];
      const rows = LIFETIME_METRICS.filter((metric) => metric.read(m) !== undefined)
        .map((metric) => {
          const value = metric.read(m);
          const sentence = buildMetricContext({
            value: isNil(value) ? null : value,
            noun: metric.noun(platformName),
            label: metric.labelText,
            window: 'all time',
            status: m.txsStatus,
            asOfFallback: snapshotTimestamp,
          });
          return sentence ? { labelText: metric.labelText, sentence } : null;
        })
        .filter(Boolean);

      if (rows.length === 0) return null;

      return (
        <table key={`${platform}-lifetime`}>
          <caption>{`${platformName} transactions by agent type, all time.`}</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.labelText}>
                <th scope="row">{`${row.labelText} (${platformName})`}</th>
                <td>{row.sentence}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  const activeWindowPhrase = windowPhrase(effectiveWindow);
  const platformPhrase = PLATFORM_PHRASE[platform];
  const platformName = PLATFORM_NAME[platform];

  const roiMeta = PERFORMANCE_METRICS.tradingRoi;
  const tradingRoiValue = roiMeta.read(m, activeWindow) ?? null;
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
    labelText: roiMeta.labelText,
    value: isNil(tradingRoiValue) ? null : roiMeta.format(tradingRoiValue),
    status: roiMeta.readStatus(m),
    href: `/data#${platform}-${roiMeta.anchor}`,
    context: {
      noun: roiMeta.noun(platformPhrase),
      window: activeWindowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  const accuracyMeta = PERFORMANCE_METRICS.accuracy;
  const accuracyValue = accuracyMeta.read(m, activeWindow) ?? null;
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
    labelText: accuracyMeta.labelText,
    value: isNil(accuracyValue) ? null : accuracyMeta.format(accuracyValue),
    status: accuracyMeta.readStatus(m),
    href: `/data#${platform}-${accuracyMeta.anchor}`,
    context: {
      noun: accuracyMeta.noun(platformPhrase),
      window: activeWindowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  const aprMeta = PERFORMANCE_METRICS.apr;
  const aprValue = aprMeta.read(m, activeWindow) ?? null;
  const aprItem: MetricItemProps = {
    label: aprMeta.labelText,
    labelText: aprMeta.labelText,
    value: isNil(aprValue) ? null : aprMeta.format(aprValue),
    status: aprMeta.readStatus(m),
    href: `/data#${platform}-${aprMeta.anchor}`,
    context: {
      noun: aprMeta.noun(platformPhrase),
      window: activeWindowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  const brierMeta = PERFORMANCE_METRICS.brier;
  const brierValue = brierMeta.read(m, activeWindow) ?? null;
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
    labelText: brierMeta.labelText,
    value: isNil(brierValue) ? null : brierMeta.format(brierValue),
    status: brierMeta.readStatus(m),
    href: `/data#${platform}-${brierMeta.anchor}`,
    context: {
      noun: brierMeta.noun(platformPhrase),
      window: activeWindowPhrase,
    },
    asOfFallback: snapshotTimestamp,
  };

  // All performance metrics respond to the time-range tabs. Brier is a 4th metric on
  // Omenstrat only (predict-polymarket doesn't index Brier yet).
  const performanceItems: MetricItemProps[] = [
    roiItem,
    aprItem,
    accuracyItem,
    ...(appliesTo(brierMeta, platform) ? [brierItem] : []),
  ];

  // These are lifetime counts and do not follow the time-range tabs, so each says
  // "all time" explicitly rather than inheriting the selected window by proximity.
  // `marketCreatorTxs` is absent (not null) on platforms that don't track it.
  const lifetimeItems: MetricItemProps[] = LIFETIME_METRICS.filter(
    (metric) => metric.read(m) !== undefined
  ).map((metric) => ({
    label: metric.labelText,
    labelText: metric.labelText,
    value: isNil(metric.read(m)) ? null : metric.read(m).toLocaleString(),
    status: m.txsStatus,
    href: `/data#${platform}-predict-transactions-by-type`,
    context: {
      noun: metric.noun(platformName),
      window: 'all time',
    },
    asOfFallback: snapshotTimestamp,
  }));

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`}>
      <PlatformSwitcher platform={platform} onChange={onPlatformChange} />

      {/* Announces the switch. Both selectors change values in place rather than
          swapping a panel, so without this a screen-reader user hears nothing when
          the whole card's meaning changes underneath them. */}
      <p className="sr-only" role="status">
        {`Showing ${platformName} performance ${activeWindowPhrase}.`}
      </p>

      <AllStatesTables
        metrics={metrics}
        activePlatform={platform}
        activeWindow={effectiveWindow}
        snapshotTimestamp={snapshotTimestamp}
      />

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
