import {
  get7DaysAvgActivity,
  getA2ATransactions,
  getTotalTransactionsCount,
  getTotalUnitsCount,
} from 'common-util/api/flipside';
import { FLIPSIDE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import chains from 'data/chains.json';
import { usePersistentSWR } from 'hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import SectionHeading from '../SectionHeading';

const BLOCKCHAIN_COUNT = chains.length;

const fetchMetrics = async () => {
  const [transactions, unitsCount, dailyActiveAgents, a2aTransactions] =
    await Promise.allSettled([
      getTotalTransactionsCount(),
      getTotalUnitsCount(),
      get7DaysAvgActivity(),
      getA2ATransactions(),
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
    a2aTransactions:
      a2aTransactions.status === 'fulfilled' ? a2aTransactions.value : null,
  };
};

export const Activity = () => {
  const { data: metrics } = usePersistentSWR('activityMetrics', fetchMetrics);

  const data = useMemo(
    () => [
      {
        id: 'transactions',
        subText: 'transactions made by Olas agents',
        value: metrics?.transactions?.toLocaleString(),
        source: FLIPSIDE_URL,
        isExternal: true,
        btmContent: (
          <div className="text-sm mt-4">
            <p className="text-slate-500 font-medium">of which</p>
            {metrics?.a2aTransactions ? (
              <ExternalLink
                className="text-2xl font-bold text-purple-600"
                href="https://flipsidecrypto.xyz/flipsideteam/q/PVARr5q0B7HD/mech-requests/visualizations/v2/34079b3c-8115-428b-9902-5a0afca3149e"
              >
                {metrics.a2aTransactions.toLocaleString()}
              </ExternalLink>
            ) : (
              <span className="text-purple-600 text-2xl">--</span>
            )}
            <p>agent-to-agent transactions</p>
          </div>
        ),
      },
      {
        id: 'agentsTypes',
        subText: 'types of agents registered by Builders',
        value: metrics?.agentsTypes,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
      {
        id: 'agents',
        subText: 'agents deployed by Operators',
        value: metrics?.agents,
        source: `${FLIPSIDE_URL}?tabIndex=5`,
        isExternal: true,
      },
      {
        id: 'blockchains',
        subText: 'blockchains Olas is deployed across',
        value: BLOCKCHAIN_COUNT,
        source: '/#chains',
        isExternal: false,
        btmContent: (
          <div className="mt-16 flex flex-row justify-between w-full">
            <Image
              key="Chains"
              src={`/images/homepage/chain-logos.png`}
              alt="Activity"
              width={340}
              height={25}
              className="w-full"
            />
          </div>
        ),
      },
    ],
    [metrics],
  );

  return (
    <SectionWrapper customClasses="text-center border-b" id="activity">
      <div className="text-7xl lg:text-9xl max-w-[750px] mx-auto pt-16 px-4">
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
        <Card className="flex flex-col items-center gap-6 p-8 mb-16 border border-purple-200 rounded-full text-xl w-fit mx-auto rounded-2xl bg-gradient-to-t from-[#F1DBFF] to-[#FDFAFF]">
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
      </div>
      <div className="w-full bg-gradient-to-t from-gray-100 to-gray-100/0 relative max-sm:h-[850px]">
        <div className="absolute z-0 bg-[url('/images/homepage/metric-bg.png')] opacity-40 h-full w-full"></div>
        <div className="py-12">
          <p className="text-xl md:text-2xl text-slate-700 mb-8 font-semibold mx-auto">
            Olas agent economies show a growing lifetime traction
          </p>
          <div className="flex flex-col max-sm:flex-row flex-wrap gap-6 mx-auto max-w-[800px] max-h-[350px]">
            {data.map((item) => {
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
                <Card
                  key={item.id}
                  className="z-10 max-w-[388px] max-sm:mx-auto max-sm:w-[400px] border-white bg-gradient-to-t from-slate-100/40 to-white/50 to-40% shadow-lg text-start px-6 py-4 rounded-xl"
                >
                  <span className="block text-4xl font-bold text-purple-600">
                    {getValue()}
                  </span>
                  <span>{item.subText}</span>
                  {item.btmContent}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
