/* eslint-disable react/prop-types */
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { useMemo } from 'react';
import { Button } from 'components/ui/button';
import Link from 'next/link';
import SectionHeading from '../SectionHeading';

const BLOCKCHAIN_COUNT = 8;

const Activity = ({
  activityMetrics: { agents, agentsTypes, transactions },
}) => {
  const data = useMemo(
    () => [
      {
        id: 'transactions',
        topText: 'Olas agents have made',
        subText: 'transactions',
        value: transactions.value?.toLocaleString(),
      },
      {
        id: 'agents',
        topText: 'Operators have deployed',
        subText: 'agents',
        value: agents.value,
      },
      {
        id: 'blockchains',
        topText: 'Olas is deployed across',
        subText: 'blockchains',
        value: BLOCKCHAIN_COUNT,
      },
      {
        id: 'agentsTypes',
        topText: 'Devs have registered',
        subText: 'types of agents',
        value: agentsTypes.value,
      },
    ],
    [],
  );

  return (
    <SectionWrapper customClasses="text-center py-16 px-4 border-b" id="activity">
      <div className="text-7xl lg:text-9xl mb-12 max-w-[750px] mx-auto mb-16">
        <Image
          alt="Placeholder"
          src="/images/generating-agents.png"
          width="270"
          height="300"
          className="mx-auto mb-16"
        />
        <SectionHeading
          color="text-gray-900"
          weight="font-bold"
        >
          Generating an Ocean of Autonomous AI Agents
        </SectionHeading>
        <p className="text-xl md:text-2xl text-slate-700 mb-8 mx-auto">
          Olas incentivizes and coordinates different parties to launch
          autonomous agents that form entire AI economies.
        </p>
        <p className="py-2 px-5 bg-purple-100 border-fuchsia-200 border-1.5 rounded-full text-xl text-purple-800 w-fit mx-auto">
          🤖 &nbsp; The first autonomous agents and economies are
          {' '}
          <span className="italic">active</span>
          .
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-0 w-max items-end mb-8">
        {data.map((item, index) => {
          let borderClassName = '';
          if (index !== 0) borderClassName += 'xl:border-l-1.5';
          if (index % 2 !== 0) borderClassName += ' md:border-l-1.5';

          return (
            <div
              key={item.id}
              className={`text-start w-[345px] py-6 2xl:py-3 px-8 border-gray-300 h-full ${borderClassName}`}
            >
              <span className="block text-xl text-slate-700 mb-4">
                {item.topText}
              </span>
              <span className="block text-6xl text-black font-extrabold mb-4">
                {item.value ?? '--'}
              </span>
              <span className="block text-xl text-slate-700">
                {item.subText}
              </span>
            </div>
          );
        })}
      </div>
      <Button variant="outline" size="xl" asChild className="mb-12">
        <Link href="/explore">Explore the ecosystem</Link>
      </Button>
    </SectionWrapper>
  );
};

export default Activity;
