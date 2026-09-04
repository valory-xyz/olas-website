import { FEE_LIVE_SINCE_SEC, MARKETPLACE_CHAIN_SCOPE } from 'common-util/constants';
import { formatUtcDate } from 'common-util/time';
import { isFrozen } from 'common-util/graphql/metric-utils';
import type { MetricWithStatus } from 'common-util/graphql/types';
import { buildMetricContext } from 'components/ui/MetricContext';
import { FEE_SWITCHES, CHAIN_PILLS, type ProtocolActivityMetrics } from './Flywheel/constants';
import { formatTokenAmount } from 'common-util/numberFormatter';

type Metric = Partial<MetricWithStatus<number | string>>;

type ActivitySummaryProps = {
  metrics?: {
    transactions?: Metric;
    ataTransactions?: Metric;
    mechFees?: Metric;
    feesCollected?: Metric;
    /** Per-token breakdown of `feesCollected`, e.g. `{ xDAI: 655.7, USDC: 100.7 }`. */
    feesCollectedByToken?: Partial<MetricWithStatus<Record<string, number> | null>>;
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
 * "held as 26,457,344 OLAS and 274 WETH" — a token breakdown as a trailing clause.
 *
 * Uses `formatTokenAmount`, the same formatter the pill tooltips use, so a holding is
 * never published as two different numbers. Returns '' when there is nothing to list, so
 * callers can interpolate it unconditionally.
 */
const tokenComposition = (
  tokens: Record<string, number> | Array<{ symbol: string; amount: number }> | null | undefined,
  lead: string
): string => {
  const entries = Array.isArray(tokens)
    ? tokens.map((t) => [t.symbol, t.amount] as const)
    : Object.entries(tokens ?? {});
  const parts = entries
    .filter(([, amount]) => typeof amount === 'number')
    .map(([symbol, amount]) => `${formatTokenAmount(amount)} ${symbol}`);
  if (!parts.length) return '';
  const list =
    parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0];
  return `, ${lead} ${list}`;
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
  const asOfFallback = snapshotTimestamp;

  // Derived, not typed out: FeeMetrics states the same date from the same constant, and
  // a second hand-written copy is one that can disagree with the first.
  const feeLiveSince = formatUtcDate(FEE_LIVE_SINCE_SEC * 1000) ?? '';

  // Which tokens the fee total is made of. Like the PoL composition above, this lives
  // only in a pill tooltip that Radix never mounts into the served HTML, so the aggregate
  // reaches a reader with no indication of what it is denominated in.
  const feeTokens = tokenComposition(metrics?.feesCollectedByToken?.value, 'collected as');

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
          noun: 'in Olas marketplace turnover — total fees collected from the Mech Marketplace, including the legacy mech contracts',
          note: 'It is the same metric the Mech economy page publishes as "Total Task Payments" — the two are one figure and differ only by snapshot refresh timing.',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.feesCollected?.value,
          status: metrics.feesCollected?.status,
          isMoney: true,
          noun: `in protocol fees collected by the Mech Marketplace, taken as a percentage of marketplace turnover rather than being additional to it${feeTokens}`,
          note: `Covers only the USD-pegged fee trackers, and only since the fee went live on ${feeLiveSince}.`,
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
        // Read from the metric rather than asserted, so the sentence stays true once the
        // burn mechanism goes live and the figure stops being zero. The explanation of
        // *why* it is zero is attached only while it is.
        buildMetricContext({
          value: olasBurned?.value,
          status: olasBurned?.status,
          unit: 'OLAS',
          noun: 'burned to date',
          // Says only what this site knows. It does not index executed burns, so the zero
          // is a placeholder, not a measurement — and any claim about how the protocol
          // burns belongs to the protocol docs, not to a metric caption.
          note:
            Number(olasBurned?.value ?? 0) > 0
              ? undefined
              : 'This figure is a placeholder rather than a measurement: this site does not yet index executed OLAS burns, so it does not track what the buy-back-and-burn module has burned.',
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
          const composition = tokenComposition(metric?.value?.tokens, 'held as');
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
    // The valuation rule matters and lives only in the (portaled) tooltip: the total is
    // not a mark-to-market figure, so a reader comparing it against today's pool value
    // would otherwise conclude the number is wrong.
    note: 'Each fee is valued at the moment the protocol collects it, so the total is not revalued and its current value in the pools may differ.',
    scope: 'across all supported chains',
    window: 'all time',
    asOfFallback: protocolSnapshotTimestamp,
  });

  // Derived from the same constant the visible toggles render, so the hidden copy can't
  // claim a switch is on while the diagram shows it off.
  const switchState = (key: keyof typeof FEE_SWITCHES) =>
    FEE_SWITCHES[key] === 'ON' ? 'switched on' : 'switched off';

  const feeSwitchLines = [
    `The Mech Marketplace fee is currently ${switchState('marketplace')}. A 15% fee is taken on payments between AI agents on the Olas Marketplace; the Governors of the Olas Protocol can turn it on or off, and it is designed to buy back and burn OLAS as the marketplace is used, as set out in AIP-5.`,
    `Fees from protocol-owned liquidity are currently ${switchState('pol')} and stay in the pools. Turning them on is subject to the implementation of AIP-7, which is designed to burn OLAS and send the remaining tokens to the Olas Treasury.`,
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
