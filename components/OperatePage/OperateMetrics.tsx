import { getMainMetrics } from 'common-util/api';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

const fetchMetrics = async () => {
  const mainMetrics = await getMainMetrics();
  const data = mainMetrics?.data;

  if (!data) {
    return {
      dailyActiveAgents: null,
      totalOperators: null,
    };
  }

  return {
    dailyActiveAgents: data.dailyActiveAgents ?? null,
    totalOperators: data.totalOperators ?? null,
  };
};

export const OperateMetrics = () => {
  // @ts-expect-error TS(2554) FIXME: Expected 3 arguments, but got 2.
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
        subText: 'All-time unique agent Operators',
        value: metrics?.totalOperators?.toLocaleString(),
        source: '/data#operators',
      },
      {
        id: 'DAA',
        imageSrc: 'DAA.png',
        labelText: 'Daily Active Agents (DAAs)',
        subText: 'Agents running daily, averaged over 7 days',
        value: metrics?.dailyActiveAgents?.toLocaleString(),
        source: '/data#daily-active-agents',
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper id="stats" customClasses="mx-4 md:mx-12 mt-24 mb-16">
      <h2
        className={`text-2xl md:text-[32px] tracking-tighter font-bold text-center mb-12`}
      >
        Hundreds of Operators are Already Running Agents
      </h2>
      {/* @ts-expect-error TS(2304) FIXME: Cannot find name 'children'. */}{' '}
      {/* @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message */}{' '}
      {/* @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message */}{' '}
      <Card className="grid md:grid-cols-2 gap-6 p-6 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index == 0)
            borderClassName +=
              'max-sm:border-b-1.5 md:border-r-1.5 border-purple-200';
          const getValue = () => {
            if (!item.value) return '--';
            return (
              <ExternalLink href={item.source} hideArrow>
                {item.value}
              </ExternalLink>
            );
          };
          return (
            <div
              key={item.id}
              className={`text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full w-full ${borderClassName}`}
            >
              <div className="flex gap-2 mb-5 justify-center items-center">
                <div className="aspect-square">
                  <Image
                    alt="Operate"
                    src={`/images/operate-page/${item.imageSrc}`}
                    width={35}
                    height={35}
                  />
                </div>
                <span className="text-lg text-black flex max-w-fit">
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
