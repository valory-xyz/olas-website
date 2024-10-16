import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import {
  getTotalTransactionsCount,
  getTotalUnitsCount,
  get7DaysAvgActivity,
} from 'common-util/api/flipside';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { Popover } from 'components/ui/popover';
import { FLIPSIDE_URL } from 'common-util/constants';
import { Card } from 'components/ui/card';
import SectionHeading from '../SectionHeading';

const BLOCKCHAIN_COUNT = 8;

const fetchMetrics = async () => {
  const [transactions, unitsCount, dailyActiveAgents] =
    await Promise.allSettled([
      getTotalTransactionsCount(),
      getTotalUnitsCount(),
      get7DaysAvgActivity(),
    ]);

  return {
    transactions:
      transactions.status === 'fulfilled' ? transactions.value : null,
    agents:
      unitsCount.status === 'fulfilled' ? unitsCount.value.agentsCount : null,
    agentsTypes:
      unitsCount.status === 'fulfilled'
        ? unitsCount.value.agentTypesCount
        : null,
    dailyActiveAgents:
      dailyActiveAgents.status === 'fulfilled' ? dailyActiveAgents.value : null,
  };
};

const usePersistentSWR = (key, fetcher) =>
  useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

export const Activity = () => {
  const { data: metrics } = usePersistentSWR('activityMetrics', fetchMetrics);

  const data = useMemo(
    () => [
      {
        id: 'transactions',
        topText: 'Olas agents have made',
        subText: 'transactions',
        value: metrics?.transactions?.toLocaleString(),
        source: FLIPSIDE_URL,
        isExternal: true,
      },
      {
        id: 'agents',
        topText: 'Operators have deployed',
        subText: 'agents',
        value: metrics?.agents,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
      {
        id: 'blockchains',
        topText: 'Olas is deployed across',
        subText: 'blockchains',
        value: BLOCKCHAIN_COUNT,
        source: '/#chains',
        isExternal: false,
      },
      {
        id: 'agentsTypes',
        topText: 'Devs have registered',
        subText: 'types of agents',
        value: metrics?.agentsTypes,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper
      customClasses="text-center py-16 px-4 border-b"
      id="activity"
    >
      <div className="text-7xl lg:text-9xl mb-12 max-w-[750px] mx-auto mb-16">
        <Image
          alt="Placeholder"
          src="/images/generating-agents.png"
          width="270"
          height="300"
          className="mx-auto mb-16"
        />
        <SectionHeading
          size="max-sm:text-5xl"
          color="text-gray-900"
          weight="font-bold"
        >
          Generating an Ocean of Autonomous AI Agents
        </SectionHeading>
        <p className="text-xl md:text-2xl text-slate-700 mb-8 mx-auto">
          Olas incentivizes and coordinates different parties to launch
          autonomous agents that form entire AI economies.
        </p>
        <Card className="flex flex-col gap-6 p-8 mb-16 border border-purple-200 rounded-full text-xl w-fit mx-auto rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
          <span>
            🤖 The first autonomous AI agents are{' '}
            <span className="font-medium">active</span>
          </span>
          {metrics?.dailyActiveAgents ? (
            <ExternalLink
              className="font-extrabold text-6xl"
              href={`${FLIPSIDE_URL}?tabIndex=1`}
              hideArrow
            >
              {metrics.dailyActiveAgents}
              <span className="text-4xl">↗</span>
            </ExternalLink>
          ) : (
            <span className="text-purple-600 text-6xl">--</span>
          )}
          <div className="flex self-center gap-2">
            Daily Active Agents (DAAs)
            <Popover>7-day average Daily Active Agents</Popover>
          </div>
        </Card>
        <p className="text-xl md:text-2xl text-slate-700 mb-8 mx-auto">
          Olas agent economies show a growing lifetime traction
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 w-max items-end mb-8">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';
          const getValue = () => {
            if (!item.value) return '--';
            if (item.isExternal) {
              return (
                <ExternalLink href={item.source} hideArrow>
                  {item.value}
                  <span className="text-2xl">↗</span>
                </ExternalLink>
              );
            }
            return <Link href={item.source}>{item.value}</Link>;
          };

          return (
            <div
              key={item.id}
              className={`text-start w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full max-sm:w-full ${borderClassName}`}
            >
              <span className="block text-xl text-slate-700 mb-4">
                {item.topText}
              </span>
              <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4 text-purple-600">
                {getValue()}
              </span>

              <span className="block text-xl text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
