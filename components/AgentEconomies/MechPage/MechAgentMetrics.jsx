import { getMechMetrics } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';
import useSWR from 'swr';

const fetchMetrics = async () => {
  const result = await getMechMetrics();
  return {
    dailyActiveAgents: result?.dailyActiveAgents ?? null,
    totalTxs: result?.totalRequests?.total ?? null,
    predictTxs: result?.predictTxs ?? null,
    contributeTxs: result?.contributeTxs ?? null,
    governatooorrTxs: result?.governatooorrTxs ?? null,
    otherTxs: result?.otherTxs ?? null,
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
              src="/images/agents/predict.png"
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
              src="/images/agents/contribute.svg"
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
              src="/images/agents/governatooorr.svg"
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
    <SectionWrapper customClasses="text-center py-16 border-t" id="stats">
      <div className="text-7xl lg:text-9xl mb-12 max-w-[650px] mx-auto mb-16 w-full">
        <Card className="flex flex-col gap-6 p-8 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
          <div className="flex items-center">
            <Image
              alt="Mech DAAs"
              src="/images/agents/mech.svg"
              width="35"
              height="35"
              className="mr-4"
            />
            Mech Agent Economy
          </div>
          {metrics?.dailyActiveAgents ? (
            <Link
              className="font-extrabold text-6xl"
              href="/data#mech-daily-active-agents"
              hideArrow
            >
              {Math.floor(metrics?.dailyActiveAgents).toLocaleString()}
            </Link>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex gap-2">
            Daily Active Agents (DAAs){' '}
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        <p className="text-xl text-slate-700 mb-8 mx-auto mt-12">
          The Olas Mech agent economy is in demand as ever, resulting in more
          than{' '}
          {typeof metrics?.totalTxs === 'number' ? (
            <Link className="font-bold" href="/data#mech-requests-categorized" hideArrow>
              {metrics.totalTxs.toLocaleString()}
            </Link>
          ) : (
            <span className="font-bold">--</span>
          )}{' '}
          requests from other AI agent economies.
        </p>
      </div>
      <div className="w-full border-y mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 items-end xl:w-max md:mx-auto">
          {data.map((item, index) => {
            let borderClassName = '';
            if (index !== 0) borderClassName += 'xl:border-l-1.5';
            if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';
            if (index < 2) borderClassName += ' sm:max-xl:border-b-1.5';
            if (index !== index.length)
              borderClassName += ' max-md:border-b-1.5';

            const getValue = () => {
              if (!item.value) return '--';
              return (
                <Link href="/data#mech-requests-categorized" hideArrow>
                  {item.value}
                </Link>
              );
            };

            return (
              <div
                key={item.id}
                className={`text-start py-6 2xl:py-3 px-8 border-gray-300 h-full ${borderClassName}`}
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
      </div>
    </SectionWrapper>
  );
};
