import { buildMetricContext } from 'components/ui/MetricContext';
import { CHAIN_PILLS, type ProtocolActivityMetrics } from './Flywheel/constants';

type Metric = {
  value?: number | string;
  status?: import('common-util/graphql/types').MetricStatus;
};

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
}: ActivitySummaryProps) => {
  if (!metrics && !protocolMetrics) return null;

  const asOfFallback = snapshotTimestamp;

  const activityLines = metrics
    ? [
        buildMetricContext({
          value: metrics.transactions?.value,
          status: metrics.transactions?.status,
          noun: 'total transactions executed by all Olas agents',
          scope: 'across all supported chains',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.ataTransactions?.value,
          status: metrics.ataTransactions?.status,
          noun: 'agent-to-agent transactions, which are a subset of the total Olas agent transactions above and not a separate total',
          scope: 'across Gnosis, Base, Polygon and Optimism',
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
          noun: 'in Olas marketplace turnover — the total fees collected from the Mech Marketplace, also shown elsewhere as "Total Task Payments", "Total Marketplace Turnover" and "Mech Turnover"',
          window: 'all time',
          asOfFallback,
        }),
        buildMetricContext({
          value: metrics.feesCollected?.value,
          status: metrics.feesCollected?.status,
          isMoney: true,
          noun: 'in protocol fees collected by the Mech Marketplace, taken as a percentage of marketplace turnover rather than being additional to it',
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
        // Hardcoded to zero in the UI and in `mech-fees.ts`: the fee trackers currently
        // live (USDC, xDAI) are non-OLAS and route to the Olas Treasury, so nothing is
        // burned from them yet. Stated explicitly so "0" is not read as a failure.
        '0 OLAS has been burned to date. Marketplace fees collected in non-OLAS tokens route to the Olas Treasury rather than being burned; OLAS-denominated fees would be burned, but no OLAS fee trackers are live yet.',
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

  const polTotal = polChains.reduce((sum, { metric }) => sum + (metric?.value?.usd ?? 0), 0);

  const polLines = polChains.length
    ? [
        buildMetricContext({
          value: polTotal,
          isMoney: true,
          status: polChains[0].metric?.status,
          noun: `in total protocol-owned liquidity held by the Olas Treasury, which is the sum of the ${polChains.length} per-chain figures that follow and not additional to them`,
          window: 'current value, not cumulative',
          asOfFallback: snapshotTimestamp,
        }),
        ...polChains.map(({ label, metric }) =>
          buildMetricContext({
            value: metric?.value?.usd,
            isMoney: true,
            status: metric?.status,
            noun: `of protocol-owned liquidity held by the Olas Treasury on ${label}`,
            window: 'current value, not cumulative',
            asOfFallback: snapshotTimestamp,
          })
        ),
      ]
    : [];

  const polFeesLine = buildMetricContext({
    value: protocolMetrics?.totalProtocolRevenue?.value,
    isMoney: true,
    status: protocolMetrics?.totalProtocolRevenue?.status,
    noun: "in cumulative swap fees earned by the Olas Treasury's protocol-owned liquidity positions, which is separate from Mech Marketplace fees",
    scope: 'across all supported chains',
    window: 'all time',
    asOfFallback: snapshotTimestamp,
  });

  const lines = [...activityLines, ...polLines, polFeesLine].filter(Boolean);

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
