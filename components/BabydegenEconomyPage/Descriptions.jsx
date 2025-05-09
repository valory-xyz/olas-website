import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const babydegens = [
  {
    id: 'modius-economy',
    src: '/images/babydegen-econ-page/modius.png',
    title: 'The Modius Economy',
    desc: (
      <>
        <p className="mb-2">
          The Modius Economy is a network of personal DeFAI agents that
          autonomously manage portfolios on Mode.
        </p>
        <p>
          Each Modius agent gathers market data, selects optimal strategies, and
          executes trades for individual users — working independently but
          collectively creating a decentralized, autonomous economy focused on
          intelligent, hands-free asset management.
        </p>
      </>
    ),
    link: '/services/babydegen#modius-agent',
  },
  {
    id: 'optimus-economy',
    src: '/images/babydegen-econ-page/optimus.png',
    title: 'The Optimus Economy',
    desc: (
      <>
        <p>
          The Optimus Economy is built from a network of Optimus agents, each
          autonomously managing assets across Optimism Mainnet.
        </p>
        <p>
          As they individually seek the best yields, they collectively form an
          evolving DeFAI economy focused on maximizing returns and expanding
          into new opportunities.
        </p>
      </>
    ),
    link: '/services/babydegen#optimus-agent',
  },
];

const WhatIsOptimus = () => (
  <div className="max-w-screen-sm mx-auto">
    <h1 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      AI Agents That Evolve Your DeFi Strategy
    </h1>
    <div className="mb-20">
      <p className="mb-2">
        The BabyDegen Economy is a network of autonomous AI agents built for one
        goal: to take over your DeFi asset management and maximize your yields —
        fully automatically.
      </p>
      <p className="mb-2">
        Each BabyDegen agent acts as an asset manager and trader, continuously
        scouting opportunities, building and adapting strategies, allocating
        resources, and executing real-time trades across blockchain networks
        like Mode, Optimism Mainnet, and Base.
      </p>
      <p>
        Together, they form an autonomous economy that powers the future of
        DeFAI, combining intelligent AI trading with decentralized finance to
        deliver hands-off, optimized performance — without the need for manual
        input.
      </p>
    </div>
  </div>
);

const AgentTypes = () => (
  <div id="babydegens-live-now">
    <h1
      className={`${SUB_HEADER_CLASS} font-semibold text-center text-4xl mb-8`}
    >
      Babydegens Live Now
    </h1>
    <div className="flex flex-col md:flex-row gap-4 gap-6 my-8">
      {babydegens.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col p-8 max-sm:w-auto w-[424px] rounded-xl mx-auto"
        >
          <Image
            alt={item.title}
            src={item.src}
            width="64"
            height="64"
            className="mb-6"
          />
          <span className="text-2xl font-bold text-black mb-4">
            {item.title}
          </span>
          <div className="mb-4">{item.desc}</div>

          <Link href={item.link} className="mt-auto text-purple-600">
            Find out more
          </Link>
        </Card>
      ))}
    </div>
  </div>
);

export const Descriptions = () => (
  <SectionWrapper customClasses="mb-16 mt-4 max-w-[872px] mx-6 md:mx-auto">
    <WhatIsOptimus />
    <AgentTypes />
  </SectionWrapper>
);
