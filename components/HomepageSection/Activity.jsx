import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';

import { Button } from 'components/ui/button';
import SectionHeading from '../SectionHeading';
import Link from "next/link";

const BLOCKCHAIN_COUNT = 8;



const Activity = ({ activityMetrics: {agents, agentsTypes, transactions} }) => {
  const data = useMemo(()=>[
  {
    id: 'transactions',
    topText: 'Olas agents have made',
    subText: "transactions",
    value: transactions.value?.toLocaleString(),
  },
  {
    id: 'agents',
    topText: 'Olas has',
    subText: "agents deployed",
    value: agents.value,
  },
  {
    id: 'blockchains',
    topText: 'Deployed across',
    subText: "blockchains",
    value: BLOCKCHAIN_COUNT,
  },
  {
    id: 'agentsTypes',
    topText: 'Devs have registered',
    subText: "types of agents",
    value: agentsTypes.value,
  },
], []);

  return (
    <SectionWrapper customClasses="text-center py-16 px-4 border-b">
      <div className="text-7xl lg:text-9xl mb-12 max-w-screen-lg mx-auto ">
        <Image
          alt="Placeholder"
          src="/images/generating-agents.png"
          width="270"
          height="300"
          className="mx-auto mb-12"
        />
        <SectionHeading color="text-gray-900" size="text-4xl md:text-6xl" weight={"font-bold"}>
          Generating an Ocean of Autonomous AI Agents
        </SectionHeading>
        <p className="text-xl md:text-3xl text-gray-900 mb-20 mx-auto">
          Olas incentivizes and coordinates different parties to launch
          autonomous agents that form entire AI economies.
        </p>
        <p className="text-xl md:text-4xl font-bold text-gray-900 mb-16 mx-auto">
          The first autonomous agents and economies are
          {' '}
          <span className="italic">active</span>
          .
        </p>
      </div>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end mb-20">
        {data.map((item) => (
          <div key={item.id} className="text-gray-900">
            <span className="block text-2xl mb-4">{item.topText}</span>
            <span className="block text-6xl font-bold mb-4 ">
              {item.value ?? '--'}
            </span>
            <span className="block text-2xl font-bold">{item.subText}</span>
          </div>
        ))}
      </div>
      {/* TODO: uncomment once explore is done */}
      {/* <Button variant="outline" size="xl" asChild className="mb-12">
        <Link href="/ecosystem">Explore the ecosystem</Link>
      </Button> */}
    </SectionWrapper>
  );
};

export default Activity;
