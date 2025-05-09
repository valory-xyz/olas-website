import { getFeeFlowMetrics } from 'common-util/api/dune';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { usePersistentSWR, useWindowWidth } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const DUNE_MMV2_URL = 'https://dune.com/queries/5103896/8420267';

const fetchMetrics = async () => {
  try {
    const result = await getFeeFlowMetrics();
    if (!result) {
      throw new Error('Failed to fetch metrics');
    }
    return {
      collectedFees: result.collectedFees,
      recievedFees: result.recievedFees,
      unclaimedFees: result.unclaimedFees,
      totalFees: result.totalFees,
    };
  } catch (error) {
    console.error('Error in fetchMetrics:', error);
    return null;
  }
};

const formatToTooltip = ({ from, to }) =>
  `${from.label} → ${to.label} | $${to.value} (${Number((to.value / from.value) * 100).toFixed(2)}%))`;

export const FeeMetrics = () => {
  const { data: metrics, error } = usePersistentSWR(
    'FeeFlowMetrics',
    fetchMetrics,
  );

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
        label: 'Total Agent Fees Collected',
        value: metrics?.totalFees || 0,
        color: '#7a9cf7',
      },
      unclaimed: {
        id: 'unclaimed',
        label: 'Unclaimed Fees',
        value: metrics?.unclaimedFees || 0,
        color: '#90a1b9',
      },
      claimed: {
        id: 'claimed',
        label: 'Claimed Fees',
        value: metrics?.claimedFees || 0,
        color: '#5fb178',
      },
      recieved: {
        id: 'received',
        label: 'Fees Received',
        value: metrics?.recievedFees || metrics?.claimedFees * 0.99 || 0,
        color: '#68bcce',
      },
      burned: {
        id: 'olas-burned',
        label: 'OLAS Burned',
        // Olas burned will always be 1% of claimed fees
        value: metrics?.claimedFees * 0.01 || 0,
        color: '#dab2e4',
      },
    }),
    [metrics],
  );

  // Sankey diagram data structure:
  // Each row represents a flow between nodes with format: [From, To, Value, Tooltip]
  // The first row defines the column headers and tooltip configuration as the tooltip text is customised
  const data = [
    ['From', 'To', '', { role: 'tooltip', type: 'string', p: { html: true } }],
    [
      // From header
      'Total Agent Fees Collected',
      // To header
      'Unclaimed Fees',
      // Branch thickness
      formerData.unclaimed.value,
      // Tooltip display
      formatToTooltip({
        from: formerData.total,
        to: formerData.unclaimed,
      }),
    ],
    [
      'Total Agent Fees Collected',
      'Claimed Fees',
      formerData.claimed.value,
      formatToTooltip({
        from: formerData.total,
        to: formerData.claimed,
      }),
    ],
    [
      'Claimed Fees',
      'OLAS Burned',
      // Using 10% for visual clarity instead of actual 1% to make the flow visible
      formerData.burned.value * 10,
      formatToTooltip({
        from: formerData.claimed,
        to: formerData.burned,
      }),
    ],
    [
      'Claimed Fees',
      'Fees Received',
      // Using 90% to fit "Claimed Fees" branch
      formerData.recieved.value * (90 / 99),
      formatToTooltip({
        from: formerData.claimed,
        to: formerData.recieved,
      }),
    ],
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

  return (
    <SectionWrapper
      customClasses="text-center py-16 px-4 border-b border-t"
      id="activity"
    >
      <div className="text-7xl lg:text-9xl mb-12 max-w-[1250px] mx-auto mb-4">
        <h2 className={`${SUB_HEADER_CLASS} font-semibold text-4xl mb-8`}>
          Mech Marketplace Fee Flow
        </h2>
        <p className="text-base text-left text-slate-700 mx-auto">
          The Mech Marketplace handles the collection of fees from the delivery
          of tasks. A Mech triggers the transfer of its accumulated payments
          from the balance tracker contract, typically at various intervals.
          Upon this transfer, a small percentage of the payment is taken as a
          DAO fee, which is subsequently burned. Here&apos;s more on{' '}
          <Link href="#the-process" className="text-purple-600">
            the process
          </Link>
          .
        </p>
      </div>

      {error ? (
        <div className="text-center py-8">Error loading metrics</div>
      ) : (
        <>
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
                  style={{ color: item.color }}
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <span className="text-base max-sm:text-sm flex flex-wrap text-black font-semibold">
                      {item.label}
                    </span>
                  </div>
                  <Link
                    href={DUNE_MMV2_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-4xl whitespace-nowrap max-sm:text-xl font-extrabold mb-4 mt-auto"
                  >
                    $ {item.value} ↗
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionWrapper>
  );
};
