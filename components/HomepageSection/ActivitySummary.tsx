import { buildMetricContext } from 'components/ui/MetricContext';

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
export const ActivitySummary = ({ metrics, snapshotTimestamp = null }: ActivitySummaryProps) => {
  if (!metrics) return null;

  const asOfFallback = snapshotTimestamp;

  const lines = [
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
  ].filter(Boolean);

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
