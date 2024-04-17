import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  getAgentsTotal,
  getAgentsTypesTotal,
  getTransactionsTotal,
} from 'common-util/api';
import { Button } from 'components/ui/button';
import SectionHeading from '../SectionHeading';

const BLOCKCHAIN_COUNT = 8;

const ACTIVITIES = [
  {
    id: 'transactions',
    title: 'transactions',
    description: 'Olas agents have made',
    value: null,
  },
  {
    id: 'agents',
    title: 'agents',
    description: 'Olas has',
    value: null,
  },
  {
    id: 'blockchains',
    title: 'blockchains',
    description: 'Deployed across',
    value: BLOCKCHAIN_COUNT,
  },
  {
    id: 'agentsTypes',
    title: 'types of agents',
    description: 'Devs have registered',
    value: null,
  },
];

const Activity = () => {
  const [data, setData] = useState(ACTIVITIES);
  const ref = useRef(false);

  const getData = async () => {
    const [agents, agentsTypes, transactions] = await Promise.allSettled([
      getAgentsTotal(),
      getAgentsTypesTotal(),
      getTransactionsTotal(),
    ]);

    const result = {
      agents: agents.value,
      agentsTypes: agentsTypes.value,
      transactions: transactions.value
        ? transactions.value.toLocaleString()
        : null,
    };

    const newData = data.map((item) => ({
      ...item,
      value: result[item.id] ?? item.value,
    }));

    setData(newData);
  };

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    getData();
  }, []);

  return (
    <SectionWrapper customClasses="text-center py-16 px-4 border-b">
      <div className="text-7xl lg:text-9xl mb-12 max-w-screen-lg mx-auto mb-12 ">
        <Image
          alt="Placeholder"
          src="/images/generating-agents.png"
          width="270"
          height="300"
          className="mx-auto mb-12"
        />
        <SectionHeading color="text-gray-900" size="text-4xl md:text-6xl">
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
            <span className="block text-2xl mb-4">{item.description}</span>
            <span className="block text-6xl font-bold mb-4 ">
              {item.value ?? '--'}
            </span>
            <span className="block text-2xl font-bold">{item.title}</span>
          </div>
        ))}
      </div>
      <Button variant="outline" size="xl" asChild className="mb-12">
        <a href="/ecosystem">Explore the ecosystem</a>
      </Button>
    </SectionWrapper>
  );
};

export default Activity;
