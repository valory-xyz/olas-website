import { getPearlDAAs } from 'common-util/api/index';
import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Link } from 'components/ui/typography';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import { useMemo } from 'react';

export const PearlMetrics = () => {
  const { data: pearlDAAs } = usePersistentSWR('pearlDAAs', getPearlDAAs);

  const data = useMemo(
    () => [
      {
        id: 'DAA',
        imageSrc: 'DAA.png',
        labelText: 'Daily Active Agents (DAAs)',
        subText: 'Agents running daily, averaged over 7 days',
        value: pearlDAAs?.dailyActiveAgents?.toLocaleString(),
        source: '/data#pearl-daily-active-agents',
      },
    ],
    [pearlDAAs],
  );

  return (
    <SectionWrapper id="daas" customClasses="mt-16 max-sm:mx-4">
      <h2 className={`${SUB_HEADER_CLASS} font-semibold text-center mb-12`}>
        Join Hundreds Already Owning AI Agents
      </h2>
      <Card className="p-6 mx-auto border border-purple-200 rounded-full text-xl w-fit rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF] items-center">
        {data.map((item) => {
          const getValue = () => {
            if (!item.value) return '--';
            return (
              <Link href={item.source} hideArrow>
                {item.value}
              </Link>
            );
          };

          return (
            <div
              key={item.id}
              className="text-center w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full w-full"
            >
              <div className="flex gap-2 mb-5 justify-center">
                <div className="aspect-square">
                  <Image
                    alt="Operate"
                    src={`/images/pearl-page/${item.imageSrc}`}
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
