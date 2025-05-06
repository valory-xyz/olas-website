import { getFeeFlowMetrics } from 'common-util/api/dune';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';
import { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import useSWR from 'swr';

const fetchMetrics = async () => {
  const result = await getFeeFlowMetrics();

  return {
    olasBurned: result.olasBurned,
    collectedFees: result.collectedFees,
    recievedFees: result.recievedFees,
    unclaimedFees: result.unclaimedFees,
    totalFees: result.totalFees,
  };
};

const usePersistentSWR = (key, fetcher) =>
  useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

export const FeeMetrics = () => {
  const { data: metrics } = usePersistentSWR('FeeFlowMetrics', fetchMetrics);

  const formerData = useMemo(() => [
    {
      id: 'total-fees',
      label: (
        <div className='flex flex-col gap-2 mb-3'>
          <span className='text-base font-semibold '>Total Agent Fees Collected</span>
        </div>
      ),
      value: metrics?.totalFees,
      // value: 38830,
      // source: MECH_ECONOMY_DASHBOARD_URL,
      color: '#7a9cf7',
    },
    {
      id: 'unclaimed',
      label: (
        <div className='flex flex-col gap-2 mb-3'>
          <span className='text-base font-semibold '>Unclaimed Fees</span>
        </div>
      ),
      value: metrics?.unclaimedFees,
      // value: 23298,
      // source: MECH_ECONOMY_DASHBOARD_URL,
      color: '#272727',
    },
    {
      id: 'claimed',
      label: (
        <div className='flex flex-col gap-2 mb-3'>
          <span className='text-base font-semibold '>Claimed Fees</span>
        </div>
      ),
      value: metrics?.collectedFees,
      // value: 15532,
      // source: MECH_ECONOMY_DASHBOARD_URL,
      color: '#5fb178',
    },
    {
      id: 'received',
      label: (
        <div className='flex flex-col gap-2 mb-3'>
          <span className='text-base font-semibold '>Fees Receieved</span>
        </div>
      ),
      value: metrics?.recievedFees,
      // value: 15376.68,
      // source: MECH_ECONOMY_DASHBOARD_URL,
      color: '#68bcce',
    },
    {
      id: 'olas-burned',
      label: (
        <div className='flex flex-col gap-2 mb-3'>
          <span className='text-base font-semibold '>OLAS Burned</span>
        </div>
      ),
      value: metrics?.olasBurned,
      // value: 155.32,
      // source: MECH_ECONOMY_DASHBOARD_URL,
      color: '#dab2e4',
    },
  ]);

  const data = [
    ['From', 'To', '', { role: 'tooltip', type: 'string', p: { html: true } }],
    [
      'Total Agent Fees Collected',
      'Unclaimed Fees',
      formerData[1].value,
      `Total Agent Fees Collected → Unclaimed Fees | $${formerData[1].value} (${((formerData[1].value / formerData[0].value) * 100).toFixed(1)}%)`,
    ],
    ['Unclaimed Fees', '', formerData[1].value, `Total Agent Fees Collected → Unclaimed Fees | $${formerData[1].value} (${((formerData[1].value / formerData[0].value) * 100).toFixed(1)}%)`],
    [
      'Total Agent Fees Collected',
      'Claimed Fees',
      formerData[2].value,
      `Total Agent Fees Collected → Claimed Fees | $${formerData[2].value} (${((formerData[2].value / formerData[0].value) * 100).toFixed(1)}%)`,
    ],
    ['Claimed Fees', 'OLAS Burned', formerData[2].value * 0.1, `Claimed Fees → OLAS Burned | $${formerData[2].value * 0.01} (1%)`],
    ['Claimed Fees', 'Fees Received', formerData[2].value * 0.9, `Claimed Fees → Fees Received | $${formerData[2].value * 0.99} (99%)`],
  ];

  const options = {
    sankey: {
      link: {
        colorMode: 'gradient',
      },
      node: {
        label: {
          fontSize: 20,
        },
        nodePadding: 40,
        colors: ['#7a9cf7', '#ffffff', '#ffffff', '#5fb178', '#dab2e4', '#68bcce'],
      },
      tooltip: {
        isHtml: true,
      },
    },
  };

  return (
    <SectionWrapper customClasses='text-center py-16 px-4 border-b border-t' id='activity'>
      <div className='text-7xl lg:text-9xl mb-12 max-w-[1250px] mx-auto mb-4'>
        <h2 className={`${SUB_HEADER_CLASS} font-semibold text-4xl mb-8`}>Mech Marketplace Fee Flow</h2>
        <p className='text-base text-left text-slate-700 mx-auto'>
          The Mech Marketplace handles the collection of fees from the delivery of tasks. A Mech triggers the transfer of its accumulated payments from the balance tracker contract, typically at
          various intervals. Upon this transfer, a small percentage of the payment is taken as a DAO fee, which is subsequently burned. Here&apos;s more on{' '}
          <Link href='#the-process' className='text-purple-600'>
            the process
          </Link>
          .
        </p>
      </div>

      <div className='place-items-center mb-8'>
        <Chart chartType='Sankey' width={1280} height={400} data={data} options={options} />
      </div>

      <div className='mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-0 w-max items-end mb-8'>
        {formerData.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';

          return (
            <div key={item.id} className={`text-start flex flex-col w-[280px] p-3 border-gray-300 h-full max-sm:w-full ${borderClassName}`} style={{ color: item.color }}>
              <div className='text-black'>{item.label}</div>
              <span className='block text-4xl whitespace-nowrap max-sm:text-4xl font-extrabold mb-4 mt-auto'>$ {item.value} ↗</span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
