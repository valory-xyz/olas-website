import { getCumulativeEmissions } from 'common-util/charts';
import { formatWeiNumber } from 'common-util/numberFormatter';
import { formatUtcAsOf } from 'common-util/time';
import { statusCaveat } from 'components/ui/MetricContext';
import type { MetricStatus } from 'common-util/graphql/types';

// The emissions series is denominated in wei, as the charts' own axis ticks show by
// running every value through `formatWeiNumber`. Convert here too, or the table would
// publish 2.76e24 labelled as OLAS.
// Full numbers, matching TokenomicsSummaryTable: "4.2M" is ambiguous read as text.
const FULL_NUMBER: Intl.NumberFormatOptions = {
  notation: 'standard',
  maximumFractionDigits: 0,
};

type EmissionData = { counter?: number; [key: string]: unknown };

/**
 * Rows mirror the four emissions charts on this page. Each chart plots a cumulative
 * series built from the same `emissions` array, so one table covers all of them —
 * claimed against claimable for each recipient group, plus the combined totals the
 * "Actual Emissions" chart shows.
 */
const ROWS: Array<{ label: string; fields: string[] }> = [
  { label: 'Dev rewards claimed (builders)', fields: ['devIncentivesTotalTopUp'] },
  { label: 'Dev rewards available for claiming (builders)', fields: ['availableDevIncentives'] },
  {
    // The activity-requirement rule explains only this pair's gap, not the dev or bond ones.
    label:
      'Staking rewards claimed (operators) — these sit in staking contracts until operators hit the respective activity requirements with their staked agents',
    fields: ['totalClaimedStakingRewards'],
  },
  { label: 'Staking rewards claimable (operators)', fields: ['totalClaimableStakingRewards'] },
  { label: 'Bond rewards claimed (bonders)', fields: ['totalBondsClaimed'] },
  { label: 'Bond rewards claimable (bonders)', fields: ['totalBondsClaimable'] },
  {
    label: 'Actual emissions, all groups combined',
    fields: ['devIncentivesTotalTopUp', 'totalClaimedStakingRewards', 'totalBondsClaimed'],
  },
  {
    label: 'Claimable emissions, all groups combined',
    fields: ['availableDevIncentives', 'totalClaimableStakingRewards', 'totalBondsClaimable'],
  },
];

/**
 * Screen-reader-only mirror of the four emissions charts, which render to `<canvas>`
 * and so contain no text at any point — invisible to crawlers and assistive technology
 * alike.
 *
 * Deliberately a summary, not a transcription: the series run to hundreds of epochs, and
 * a full table would bloat the HTML while adding little a reader would ever quote. The
 * cumulative total is the last point of each running sum, which is what the charts'
 * right-hand edge shows.
 *
 * Same pattern as `TokenomicsSummaryTable`.
 */
export const EmissionsSummaryTable = ({
  emissions,
  status,
  snapshotTimestamp = null,
}: {
  emissions?: EmissionData[];
  status?: MetricStatus;
  snapshotTimestamp?: number | null;
}) => {
  if (!emissions?.length) return null;

  // `?? 0` would turn a missing counter into a finite 0 and yield "epochs 0 to 0",
  // so parse first and drop what doesn't resolve.
  const epochs = emissions
    .map((e) => Number(e.counter))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  const firstEpoch = epochs.length ? epochs[0] : null;
  const lastEpoch = epochs.length ? epochs[epochs.length - 1] : null;
  // min/max alone don't prove the range is unbroken, and "covering" claims it is.
  const isContiguous =
    firstEpoch !== null && lastEpoch !== null && epochs.length === lastEpoch - firstEpoch + 1;

  const rows = ROWS.map(({ label, fields }) => {
    const series = getCumulativeEmissions(emissions, fields);
    const total = series.length ? series[series.length - 1] : null;
    return { label, total };
  }).filter((row) => typeof row.total === 'number' && Number.isFinite(row.total));

  const asOf = formatUtcAsOf(status?.lastValidAt ?? snapshotTimestamp);
  const caveat = statusCaveat(status, 'data');

  if (!rows.length) return null;

  return (
    <section aria-label="OLAS emissions summary" className="sr-only">
      <table>
        <caption>
          {`Cumulative OLAS emissions${
            firstEpoch !== null && lastEpoch !== null
              ? isContiguous
                ? `, epochs ${firstEpoch} to ${lastEpoch}`
                : `, spanning epochs ${firstEpoch} to ${lastEpoch} with gaps`
              : ''
          }. Each figure is a running total, not a per-epoch amount. The latest epoch is still open, so rows fed by different fields may end on different epochs.${
            asOf ? ` As of ${asOf}.` : ''
          }${caveat}`}
        </caption>
        <tbody>
          {rows.map(({ label, total }) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{`${formatWeiNumber(String(total), FULL_NUMBER)} OLAS`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
