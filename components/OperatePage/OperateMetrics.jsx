import { getTotalUniqueStakers } from 'common-util/api/dune';
import { getSevenDayAvgDailyActiveAgents } from 'common-util/api/flipside';
import {
  OLAS_ECONOMY_DASHBOARD_URL,
  PREDICTION_ECONOMY_DASHBOARD_URL,
} from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import { useMemo } from 'react';
import useSWR from 'swr';

const fetchMetrics = async () => {
  const dailyActiveAgents = await getSevenDayAvgDailyActiveAgents();
  const totalUniqueStakers = await getTotalUniqueStakers();

  return {
    dailyActiveAgents: dailyActiveAgents || null,
    totalUniqueStakers: totalUniqueStakers || null,
  };
};

const usePersistentSWR = (key, fetcher) =>
  useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

export const OperateMetrics = () => {
  const { data: metrics } = usePersistentSWR(
    'operateActivityMetrics',
    fetchMetrics,
  );

  const data = useMemo(
    () => [
      {
        id: 'operators',
        imageSrc: 'operators.png',
        labelText: 'Operators',
        subText: 'All-time unique operators',
        value: metrics?.totalUniqueStakers?.toLocaleString(),
        source: OLAS_ECONOMY_DASHBOARD_URL,
      },
      {
        id: 'DAA',
        imageSrc: 'DAA.png',
        labelText: 'Daily active agents (DAAs)',
        subText: '7-day average',
        value: metrics?.dailyActiveAgents?.toLocaleString(),
        source: PREDICTION_ECONOMY_DASHBOARD_URL,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper customClasses="mt-16">
      <Card className="flex flex-row gap-6 p-6 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index == 0)
            borderClassName += 'lg:border-r-1.5 border-purple-200';

          const getValue = () => {
            if (!item.value) return '--';
            return (
              <ExternalLink href={item.source} hideArrow>
                {item.value}
                <span className="text-2xl">↗</span>
              </ExternalLink>
            );
          };

          return (
            <div
              key={item.id}
              className={`text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full max-sm:w-full ${borderClassName}`}
            >
              <div className="flex gap-2 mb-5 justify-center">
                <Image
                  alt="Operate"
                  src={`/images/operate-page/${item.imageSrc}`}
                  width={35}
                  height={35}
                />
                <span className="text-lg text-black flex items-center">
                  {item.labelText}
                </span>
              </div>
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                {getValue()}
              </span>
              <span className="block text-lg text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </Card>
    </SectionWrapper>
  );
};
