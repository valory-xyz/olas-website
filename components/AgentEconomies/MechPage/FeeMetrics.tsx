import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { isNil } from 'lodash';
import { FEE_LIVE_SINCE_SEC } from 'common-util/constants';
import { formatFullNumber } from 'components/ui/MetricContext';
import { formatUtcAsOf, formatUtcDate } from 'common-util/time';
import { isFrozen } from 'common-util/graphql/metric-utils';
import type { MetricStatus } from 'common-util/graphql/types';
import { Popover } from 'components/ui/popover';
import { StaleIndicator } from 'components/ui/StaleIndicator';
import { useWindowWidth } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const formatToTooltip = ({ from, to }) =>
  `${from.label} → ${to.label} | $${to.value.toFixed(2)} (${Number((to.value / from.value) * 100).toFixed(2)}%)`;

export const FeeMetrics = ({ metrics, snapshotTimestamp = null }) => {
  const windowWidth = useWindowWidth();

  const chartSizes = useMemo(() => {
    if (windowWidth < 640) return { fontSize: 12, chartHeight: 200 };
    if (windowWidth < 1024) return { fontSize: 16, chartHeight: 300 };
    return { fontSize: 20, chartHeight: 400 };
  }, [windowWidth]);

  const formerData = useMemo(
    () => ({
      total: {
        id: 'total-fees',
        label: 'Total Task Payments',
        description: 'Micropayments made by agents (demand-side) when requesting tasks.',
        value: metrics?.totalFees?.value || 0,
        status: metrics?.totalFees?.status,
        color: '#7a9cf7',
      },
      unclaimed: {
        id: 'unclaimed',
        label: 'Unclaimed Payments',
        description: 'Micropayments not yet claimed by mechs (supply-side).',
        value: metrics?.unclaimedFees?.value || 0,
        status: metrics?.unclaimedFees?.status,
        color: '#90a1b9',
      },
      claimed: {
        id: 'claimed',
        label: 'Claimed Payments',
        description: 'Micropayments already claimed by mechs (supply-side).',
        value: metrics?.claimedFees?.value || 0,
        status: metrics?.claimedFees?.status,
        color: '#5fb178',
      },
      recieved: {
        id: 'received',
        label: 'Realised Mech Earnings',
        description: 'Micropayments received by mechs (supply-side) after marketplace fees.',
        value: metrics?.recievedFees?.value || 0,
        status: metrics?.recievedFees?.status,
        color: '#68bcce',
      },
      burned: {
        id: 'fees-collected',
        label: 'Fees Collected',
        description:
          'Collected fees are later distributed by the DAO — non-OLAS fees to the Olas Treasury, OLAS fees burned.',
        value: metrics?.protocolFees?.value || 0,
        status: metrics?.protocolFees?.status,
        color: '#dab2e4',
      },
    }),
    [metrics]
  );

  /**
   * Function to derive the widths of the Sankey diagram branches.
   * Uses the real collected-fees value, but keeps the branch at least 1% of claimed
   * payments so it stays visible when fees are tiny, and never wider than claimed
   * payments so the realised-earnings branch can't go negative.
   */
  const CheckOlasBurnt = () => {
    const { burned, claimed } = formerData;

    const feesBranch = Math.min(Math.max(burned.value, claimed.value * 0.01), claimed.value);

    return {
      olasBurnedBranch: feesBranch,
      // Subtract the fees branch from the claimed payments to get the recievedFeesBranch (in order to keep the input & output values equal)
      recievedFeesBranch: Math.max(claimed.value - feesBranch, 0),
    };
  };

  // Sankey diagram data structure:
  // Each row represents a flow between nodes with format: [From, To, Value, Tooltip]
  // The first row defines the column headers and tooltip configuration as the tooltip text is customised
  const data = [
    ['From', 'To', '', { role: 'tooltip', type: 'string', p: { html: true } }],
    [
      // From header
      'Total Task Payments',
      // To header
      'Unclaimed Payments',
      // Branch thickness
      Math.max(formerData.unclaimed.value, formerData.total.value * 0.01),
      // Tooltip display
      formatToTooltip({
        from: formerData.total,
        to: formerData.unclaimed,
      }),
    ],
    [
      'Total Task Payments',
      'Claimed Payments',
      formerData.claimed.value,
      formatToTooltip({
        from: formerData.total,
        to: formerData.claimed,
      }),
    ],
    [
      'Claimed Payments',
      'Fees Collected',
      CheckOlasBurnt().olasBurnedBranch,
      formatToTooltip({
        from: formerData.claimed,
        to: formerData.burned,
      }),
    ],
    [
      'Claimed Payments',
      'Realised Mech Earnings',
      CheckOlasBurnt().recievedFeesBranch,
      formatToTooltip({
        from: formerData.claimed,
        to: formerData.recieved,
      }),
    ],
    // Add a small dummy flow when collected fees are 0 to maintain spacing between Unclaimed Payments and Fees Recieved node
    ...(formerData.burned.value === 0 ? [['Claimed Payments', 'Fees Collected', 0.01, '']] : []),
  ];

  const options = {
    sankey: {
      link: {
        colorMode: 'gradient',
      },
      node: {
        label: {
          fontSize: chartSizes.fontSize,
        },
        nodePadding: 40,
        colors: ['#7a9cf7', '#ffffff', '#5fb178', '#dab2e4', '#68bcce'],
      },
      tooltip: {
        isHtml: true,
      },
    },
  };

  // Claimed Payments and Realised Mech Earnings publish the same figure: the subgraph's
  // `totalFeesOutUSD` sums `Withdraw` events, which are what mechs actually receive after
  // the marketplace fee (the fee leaves separately via `Drained`). The Sankey keeps its
  // branches balanced by deriving the realised width as claimed − fees, so the picture
  // reads as two amounts where the data holds one. Stated here so the tiles are not summed.
  // Date the 15% marketplace fee was switched on, from the same constant the fee scan
  // uses, so the prose cannot drift from the data behind it.
  const feeLiveSince = formatUtcDate(FEE_LIVE_SINCE_SEC * 1000) ?? '';
  // Each statement is built from its own metric, not from `formerData` (which coerces a
  // missing child to 0) and not dated from `totalFees` alone. A child that is missing is
  // omitted rather than published as $0, and one that is frozen says so — the same
  // contract `buildMetricContext` enforces for single values.
  const feeSentence = (
    metric: { value?: number | null; status?: MetricStatus } | undefined,
    describe: (amount: string) => string
  ): string | null => {
    if (isNil(metric?.value)) return null;
    const amount = formatFullNumber(metric.value, { isMoney: true });
    if (!amount) return null;
    const asOf = formatUtcAsOf(metric.status?.lastValidAt ?? snapshotTimestamp);
    const caveat = isFrozen(metric.status)
      ? ' This is the last confirmed value; the live source is currently unavailable.'
      : '';
    // Date each sentence only when the figures were not all captured together; otherwise
    // one trailing stamp reads better than repeating the same date four times.
    const stamp = asOf && asOf !== sharedAsOf ? ` As of ${asOf}.` : '';
    return `${describe(amount)}${stamp}${caveat}`;
  };

  // If every child carries the same as-of, state it once at the end.
  const childMetrics = [
    metrics?.totalFees,
    metrics?.claimedFees,
    metrics?.recievedFees,
    metrics?.unclaimedFees,
    metrics?.protocolFees,
  ];
  const stamps = Array.from(
    new Set(
      childMetrics
        .filter((m) => !isNil(m?.value))
        .map((m) => formatUtcAsOf(m?.status?.lastValidAt ?? snapshotTimestamp))
        .filter(Boolean)
    )
  );
  const sharedAsOf = stamps.length === 1 ? stamps[0] : null;

  const claimed = metrics?.claimedFees;
  const received = metrics?.recievedFees;

  const feeFlowSummary =
    [
      feeSentence(
        metrics?.totalFees,
        (a) => `Total task payments ${a} is the gross amount paid by requesting agents.`
      ),
      !isNil(claimed?.value) && !isNil(received?.value) && claimed.value === received.value
        ? feeSentence(
            claimed,
            (a) =>
              `Claimed payments and realised mech earnings both show ${a}. These are one figure under two names — the total withdrawn by mechs, already net of the marketplace fee — not two separate amounts to be added together.`
          )
        : [
            feeSentence(claimed, (a) => `Claimed payments is ${a}.`),
            feeSentence(
              received,
              (a) =>
                `Realised mech earnings is ${a}, the portion mechs keep after the marketplace fee, so the two are not additive.`
            ),
          ]
            .filter(Boolean)
            .join(' ') || null,
      feeSentence(
        metrics?.unclaimedFees,
        // Deliberately not called "still owed to mechs": it is in − out, so it also
        // contains protocol fees that have left the mechs' entitlement.
        (a) =>
          `Unclaimed payments ${a} is the residual of task payments minus withdrawals, which also contains protocol fees not yet attributed, so it is not purely what is still owed to mechs.`
      ),
      feeSentence(
        metrics?.protocolFees,
        (a) =>
          `Fees collected ${a} is the marketplace fee taken out of task payments, not revenue additional to them. It covers only the USD-pegged fee trackers and only since the fee went live on ${feeLiveSince}.`
      ),
    ]
      .filter(Boolean)
      .join(' ') || null;

  const feeFlowText =
    feeFlowSummary && sharedAsOf
      ? `${feeFlowSummary} All figures as of ${sharedAsOf}.`
      : feeFlowSummary;

  return (
    <SectionWrapper customClasses="text-center py-16 px-4 border-b" id="fee-flow">
      {feeFlowText && <p className="sr-only">{feeFlowText}</p>}
      <div className="text-7xl lg:text-9xl mb-12 max-w-[1250px] mx-auto mb-4">
        <h2 className={`${SUB_HEADER_CLASS} font-semibold text-4xl mb-8`}>
          Mech Marketplace Fee Flow
        </h2>
        <p className="text-base text-left text-slate-700 mx-auto">
          The Mech Marketplace handles the collection of fees from the delivery of tasks. A Mech
          triggers the transfer of its accumulated payments from the balance tracker contract,
          typically at various intervals. Upon this transfer, a percentage of the payment is taken
          as a DAO fee, later distributed by the DAO — non-OLAS fees to the Olas Treasury and OLAS
          fees burned. Here&apos;s more on{' '}
          <Link href="#process" className="text-purple-600">
            the process
          </Link>
          .
        </p>
      </div>

      <div className="w-full max-w-full overflow-x-auto my-8">
        <div className="min-w-[320px] max-w-7xl mx-auto w-full overflow-hidden">
          <Chart
            chartType="Sankey"
            width="100%"
            height={chartSizes.chartHeight}
            data={data}
            options={options}
          />
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 xl:grid-cols-5 gap-0 w-full items-end mb-8 max-w-7xl mx-auto">
        {Object.values(formerData).map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' border-l-1.5';

          return (
            <div
              key={item.id}
              className={`text-start flex flex-col w-[280px] p-3 border-gray-300 h-full max-sm:w-full ${borderClassName}`}
            >
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex flex-wrap gap-2 text-black">
                  <span className="text-base max-sm:text-sm font-semibold">{item.label}</span>
                  <Popover contentClassName="max-w-[260px] text-left font-normal">
                    {item.description}
                  </Popover>
                </div>
              </div>
              <Link
                href={item.id === 'fees-collected' ? '/data#protocol-fees' : '/data#mech-turnover'}
                className="block text-3xl max-sm:text-xl font-extrabold mb-4 mt-auto"
              >
                <div className="flex items-center gap-2 text-black">
                  <span style={{ color: item.color }}>
                    $ {Number(item.value.toFixed(2)).toLocaleString()}
                  </span>
                  <StaleIndicator status={item.status} />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
