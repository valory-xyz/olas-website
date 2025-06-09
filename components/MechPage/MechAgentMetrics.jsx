import { getMechTxs, getTotalMechTxs } from 'common-util/api/dune';
import {
  DUNE_CLASSIFIED_REQUESTS_QUERY_URL,
  DUNE_TOTAL_TRANSACTIONS_QUERY_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';
import useSWR from 'swr';

const fetchMetrics = async () => {
  const [totalTxs, result] = await Promise.allSettled([
    getTotalMechTxs(),
    getMechTxs(),
  ]);

  const mechTxs = result.status === 'fulfilled' ? result.value : null;

  return {
    totalTxs: totalTxs.status === 'fulfilled' ? totalTxs.value : null,
    predictTxs: mechTxs?.predictTxs || null,
    contributeTxs: mechTxs?.contributeTxs || null,
    governatooorrTxs: mechTxs?.governatooorrTxs || null,
    otherTxs: mechTxs?.otherTxs || null,
  };
};

const usePersistentSWR = (key, fetcher) =>
  useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

export const MechAgentMetrics = () => {
  const { data: metrics } = usePersistentSWR(
    'mechActivityMetrics',
    fetchMetrics,
  );

  const data = useMemo(
    () => [
      {
        id: 'predict',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Mech"
              src="/images/services/predict.png"
              width="35"
              height="35"
            />
            <span className="text-base font-semibold text-black">Predict</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.predictTxs?.toLocaleString(),
      },
      {
        id: 'contribute',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Mech"
              src="/images/services/contribute.svg"
              width="35"
              height="35"
            />
            <span className="text-base font-semibold text-black">
              Contribute
            </span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.contributeTxs?.toLocaleString(),
      },
      {
        id: 'governatooor',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <Image
              alt="Mech"
              src="/images/services/governatooorr.svg"
              width="35"
              height="35"
            />
            <span className="text-base font-semibold text-black">
              Governatooor
            </span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.governatooorrTxs?.toLocaleString(),
      },
      {
        id: 'other',
        label: (
          <div className="flex flex-col gap-2 mb-3">
            <div className="w-[35px] h-[35px]"></div>
            <span className="text-base font-semibold text-black">Other</span>
          </div>
        ),
        subText: 'requests',
        value: metrics?.otherTxs?.toLocaleString(),
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper
      customClasses="text-center py-16 px-4 border-b border-t"
      id="stats"
    >
      <div className="text-7xl lg:text-9xl mb-12 max-w-[650px] mx-auto mb-16">
        <p className="text-xl text-slate-700 mb-8 mx-auto">
          The Olas Mech agent economy is thriving, powering over{' '}
          <ExternalLink
            className="font-bold"
            href={DUNE_TOTAL_TRANSACTIONS_QUERY_URL}
            hideArrow
          >
            {metrics?.totalTxs.toLocaleString()}&nbsp;↗
          </ExternalLink>{' '}
          requests autonomously driven by agents in Olas.
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 w-max items-end mb-8">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';

          const getValue = () => {
            if (!item.value) return '--';
            return (
              <ExternalLink href={DUNE_CLASSIFIED_REQUESTS_QUERY_URL} hideArrow>
                {item.value}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            );
          };

          return (
            <div
              key={item.id}
              className={`text-start w-[321px] py-6 2xl:py-3 px-8 border-gray-300 h-full max-sm:w-full ${borderClassName}`}
            >
              {item.label}
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                {getValue()}
              </span>
              <span className="block text-base text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
