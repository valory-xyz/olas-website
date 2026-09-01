import { MARKETPLACE_CHAIN_SCOPE } from 'common-util/constants';
import { isFrozen } from 'common-util/graphql/metric-utils';
import type { MetricWithStatus } from 'common-util/graphql/types';
import { buildMetricContext, formatFullNumber } from 'components/ui/MetricContext';
import { CHAIN_PILLS, type ProtocolActivityMetrics } from './Flywheel/constants';

type Metric = Partial<MetricWithStatus<number | string>>;

type ActivitySummaryProps = {
  metrics?: {
    transactions?: Metric;
    ataTransactions?: Metric;
    mechFees?: Metric;
    feesCollected?: Metric;
    dailyActiveAgents?: Metric;
    olasStaked?: Metric;
    totalOperators?: Metric;
  } | null;
  /** Flywheel protocol-owned-liquidity slice; its per-chain values render as bare
   *  dollar figures whose chain name lives only in an icon alt and a tooltip. */
  protocolMetrics?: ProtocolActivityMetrics;
  snapshotTimestamp?: number | null;
  /**
   * Timestamp of the `other` snapshot, which is where the protocol-owned-liquidity
   * metrics come from. It refreshes every 6 hours against the main snapshot's hourly
   * cadence, so the two must not share a fallback.
   */
  protocolSnapshotTimestamp?: number | null;
  /** OLAS burned to date, from the `agent-economies` snapshot's mech-fee slice. */
  olasBurned?: Metric;
  /** Timestamp of the `agent-economies` snapshot, which `olasBurned` comes from. */
  economySnapshotTimestamp?: number | null;
};

/**
 * Screen-reader-only summary of the homepage activity metrics.
 *
 * Rendered once, deliberately: the activity cards are duplicated for the desktop and
 * mobile layouts, so attaching context to each tile would emit every sentence twice.
 * A single block also lets related figures sit together, which is how a retrieved
 * passage is read — the total and the agent-to-agent subset only make sense as a pair.
 *
 * Same pattern as `OlasTokenPage/TokenomicsSummaryTable`.
 */
export const ActivitySummary = ({
  metrics,
  protocolMetrics,
  snapshotTimestamp = null,
  protocolSnapshotTimestamp = null,
  olasBurned,
  economySnapshotTimestamp = null,
}: ActivitySummaryProps) => {
  if (!metrics && !protocolMetrics) return null;

  const asOfFallback = snapshotTimestamp;

  const activityLines = metrics
    ? [
        buildMetricContext({
          value: metrics.transactions?.value,
          status: metrics.transactions?.status,
          noun: 'total on-chain transactions executed by all Olas agents',
          scope: 'across all supported chains',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.ataTransactions?.value,
          status: metrics.ataTransactions?.status,
          noun: 'agent-to-agent transactions, which are a subset of the total Olas agent transactions above and not a separate total',
          scope: `across ${MARKETPLACE_CHAIN_SCOPE}`,
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.dailyActiveAgents?.value,
          status: metrics.dailyActiveAgents?.status,
          noun: 'daily active Olas agents, measured as unique multisigs active each day',
          scope: 'across all supported chains',
          window: '7-day average',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.mechFees?.value,
          status: metrics.mechFees?.status,
          isMoney: true,
          // One canonical name, with the aliases named, so the four labels used across
          // the site resolve to a single metric rather than four different ones.
          noun: 'in Olas marketplace turnover — total fees collected from the Mech Marketplace, including the legacy mech contracts. It is the same metric the Mech economy page publishes as "Total Task Payments" — the two are one figure and differ only by snapshot refresh timing',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.feesCollected?.value,
          status: metrics.feesCollected?.status,
          isMoney: true,
          noun: 'in protocol fees collected by the Mech Marketplace, taken as a percentage of marketplace turnover rather than being additional to it. Covers only the USD-pegged fee trackers and only since the fee went live on 15 June 2026',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.olasStaked?.value,
          status: metrics.olasStaked?.status,
          unit: 'OLAS',
          noun: 'currently staked by operators',
          scope: 'across all supported chains',
          window: 'current total, not cumulative',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.totalOperators?.value,
          status: metrics.totalOperators?.status,
          // The visible label reads "Agents deployed", but the underlying metric counts
          // operators. Naming both prevents the two readings being taken as one fact.
          noun: 'unique operators running Olas agents, shown on this page under the visible label "Agents deployed"',
          scope: 'across all supported chains',
          window: 'all time',
          asOfFallback,
        }),
        // Read from the metric rather than asserted, so the sentence stays true once
        // OLAS-denominated fee trackers go live and the figure stops being zero. The
        // explanation of *why* it is zero is attached only while it is.
        buildMetricContext({
          value: olasBurned?.value,
          status: olasBurned?.status,
          unit: 'OLAS',
          noun:
            Number(olasBurned?.value ?? 0) > 0
              ? 'burned to date from OLAS-denominated Mech Marketplace fees'
              : 'burned to date — marketplace fees collected in non-OLAS tokens route to the Olas Treasury rather than being burned, and no OLAS fee trackers are live yet',
          window: 'all time',
          asOfFallback: economySnapshotTimestamp,
        }),
      ]
    : [];

  // Protocol-owned liquidity. The panel renders one pill per chain showing only a
  // dollar figure, and it renders twice (desktop diagram + mobile grid), so the
  // chains are named once here instead. The total is stated first and explicitly
  // marked as the sum, so the per-chain figures are not added to it a second time.
  const polChains = CHAIN_PILLS.map(({ key, label }) => ({
    label,
    metric: protocolMetrics?.polByChain?.[key],
  })).filter(({ metric }) => typeof metric?.value?.usd === 'number');

  // Published total rather than a sum of the rounded pills — the two differ by a couple
  // of dollars, and the bond page publishes this same field.
  const polTotal = protocolMetrics?.totalProtocolOwnedLiquidity?.value ?? null;

  const polLines = polChains.length
    ? [
        buildMetricContext({
          value: polTotal,
          isMoney: true,
          // Any frozen chain makes the sum partly held-over, so surface that status
          // rather than whichever chain happens to be first.
          status:
            protocolMetrics?.totalProtocolOwnedLiquidity?.status ??
            polChains.find(({ metric }) => isFrozen(metric?.status))?.metric?.status ??
            polChains[0].metric?.status,
          noun: `in total protocol-owned liquidity held by the Olas Treasury, which the ${polChains.length} per-chain figures below break down rather than add to`,
          window: 'current value, not cumulative',
          asOfFallback: protocolSnapshotTimestamp,
        }),
        ...polChains.map(({ label, metric }) => {
          // Token composition comes from the pill's tooltip, which never reaches the
          // DOM and renders twice besides. Named here so each chain's holding is
          // readable once.
          const tokens = metric?.value?.tokens ?? [];
          const composition = tokens.length
            ? `, held as ${tokens
                .map((t) => `${formatFullNumber(t.amount) ?? t.amount} ${t.symbol}`)
                .join(' and ')}`
            : '';
          return buildMetricContext({
            value: metric?.value?.usd,
            isMoney: true,
            status: metric?.status,
            noun: `of protocol-owned liquidity held by the Olas Treasury on ${label}${composition}`,
            window: 'current value, not cumulative',
            asOfFallback: protocolSnapshotTimestamp,
          });
        }),
      ]
    : [];

  const polFeesLine = buildMetricContext({
    value: protocolMetrics?.totalProtocolRevenue?.value,
    isMoney: true,
    status: protocolMetrics?.totalProtocolRevenue?.status,
    noun: "in cumulative swap fees earned by the Olas Treasury's protocol-owned liquidity positions, which is separate from Mech Marketplace fees",
    scope: 'across all supported chains',
    window: 'all time',
    asOfFallback: protocolSnapshotTimestamp,
  });

  const feeSwitchLines = [
    'The Mech Marketplace fee is currently switched on. A 15% fee is taken on payments between AI agents on the Olas Marketplace; the Governors of the Olas Protocol can turn it on or off, and it is designed to buy back and burn OLAS as the marketplace is used.',
    'Fees from protocol-owned liquidity are currently switched off and stay in the pools. Turning them on is subject to the implementation of AIP-7, which is designed to burn OLAS and send the remaining tokens to the Olas Treasury.',
  ];

  const lines = [...activityLines, ...polLines, polFeesLine, ...feeSwitchLines].filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <section aria-label="Olas network metrics summary" className="sr-only">
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
};
