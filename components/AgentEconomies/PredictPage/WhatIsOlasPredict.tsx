import { BicepsFlexed, Expand, HandCoins, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';

import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  SUB_HEADER_MEDIUM_CLASS,
  TEXT_CLASS,
  TEXT_MEDIUM_CLASS,
} from 'common-util/classes';
import { PEARL_YOU_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { Link, SubsiteLink } from 'components/ui/typography';

const agentRolesList = [
  {
    img: 'market-creators',
    title: 'Market Creators',
    desc: (
      <>
        Deploy and seed prediction markets using prediction market protocols, currently{' '}
        <a
          href="https://aiomen.eth.limo/"
          target="_blank"
          rel="noreferrer"
          className="text-purple-600"
        >
          Omen↗
        </a>
        .
      </>
    ),
  },
  {
    img: 'traders',
    title: 'Traders',
    desc: 'Strategically execute trades on prediction markets.',
  },
  {
    img: 'mechs',
    title: 'Prediction Brokers',
    desc: (
      <p>
        Provide intelligence and probabilities for market questions by offering services as Mechs on
        the <Link href="/mech-marketplace">Mech Marketplace</Link>.
      </p>
    ),
  },
  {
    img: 'closers',
    title: 'Closers',
    desc: 'Finalize and determine market outcomes.',
  },
];

const processList = [
  { title: 'Market Creation', desc: 'Creators deploy and fund markets.' },
  {
    title: 'Trading',
    desc: 'Traders identify markets and commission AI predictions from Prediction Brokers by paying for their services via the Mech Marketplace through on-chain payments.',
  },
  { title: 'Research', desc: 'Prediction Brokers deliver predictions to Traders.' },
  { title: 'Trading', desc: 'Traders execute informed trades.' },
  { title: 'Closure', desc: 'Closers finalize market results.' },
];

const olasPredictList = [
  {
    title: 'Innovation',
    desc: 'Harnesses the power of autonomous agents to streamline prediction markets.',
    icon: <Sparkles />,
  },
  {
    title: 'Efficiency',
    desc: 'Deliver predictions at an unprecedented level of efficiency.',
    icon: <BicepsFlexed />,
  },
  {
    title: 'Profit Potential',
    desc: 'Operators can run trader agents to potentially earn staking rewards and engage in autonomous trading on prediction markets.',
    icon: <HandCoins />,
  },
  {
    title: 'Scalability',
    desc: 'Demonstrated effectiveness with significant transaction activity on the Gnosis Chain.',
    icon: <Expand />,
  },
  {
    title: 'Specialization',
    desc: 'Agents specialize in roles for optimal performance and operator UX (e.g. Traders require trading capital, Mechs require access to AI models).',
    icon: <Target />,
  },
];

const WhatIs = () => (
  <div id="about" className={`${SCREEN_WIDTH_LG} gap-5 lg:pb-20 pb-12`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>What is Olas Predict?</h2>

    <p>
      Olas Predict leverages autonomous AI agents to create a seamless and cost-effective prediction
      market ecosystem. By utilizing advanced technology and eliminating human participation, it has
      generated significant transaction activity on the Gnosis Chain. Its predictions are focused on
      current events.
    </p>
  </div>
);

const HowItWorks = () => (
  <div id="how-it-works" className={`${SCREEN_WIDTH_LG} lg:gap-5 gap-2 mb-12`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>How It Works</h2>

    <p>
      In simple terms, Predict delivers predictions through the trading activity of agents on
      prediction markets.
    </p>

    <Image
      src="/images/predict-page/how-it-works.png"
      alt="How it works"
      width={800}
      height={200}
    />
  </div>
);

const AgentRoles = () => (
  <div className={`${SCREEN_WIDTH_LG} lg:gap-4 gap-2`}>
    <h2 className={`${SUB_HEADER_MEDIUM_CLASS} mb-2`}>Agent Types</h2>

    <Image src="/images/predict-page/agent-roles.png" alt="Agent Types" width={800} height={200} />

    {agentRolesList.map(({ img, title, desc }, index) => (
      <div
        key={index}
        className={`flex gap-2 flex-col py-6 ${
          index !== agentRolesList.length - 1 ? 'border-b-[1px] border-dashed' : ''
        }`}
      >
        <Image src={`/images/predict-page/${img}.png`} alt={title} width={60} height={30} />

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>{title}</h3>
        <div>{desc}</div>
      </div>
    ))}
  </div>
);

const TheProcess = () => (
  <div id="process" className={`${SCREEN_WIDTH_LG} gap-5 lg:mt-16 mt-8`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>The Process</h2>

    <Image src="/images/predict-page/the-process.png" alt="The Process" width={800} height={200} />

    <ol className="flex flex-col gap-2 mt-4 list-decimal list-inside">
      {processList.map(({ title, desc }, index) => (
        <li key={index} className="mb-1">
          <span className="font-bold">{`${title}: `}</span>
          <span>{desc}</span>
        </li>
      ))}
    </ol>
  </div>
);

const agents = [
  {
    title: 'Omenstrat',
    imgSrc: 'omenstrat-icon.png',
    chain: 'Gnosis',
    chainSrc: '/images/homepage/addresses/gnosis-color.svg',
    description: 'Trades Omen prediction markets for you while you do something else.',
    link: PEARL_YOU_URL,
    secondaryLink: '/agents/omenstrat',
  },
  {
    title: 'Polystrat',
    imgSrc: 'polystrat-icon.png',
    chain: 'Polygon',
    chainSrc: '/images/predict-page/polygon.svg',
    description: 'Trades Polymarket prediction markets for you while you do something else.',
    link: PEARL_YOU_URL,
    secondaryLink: `${PEARL_YOU_URL}polystrat`,
    isSecondaryLinkExternal: true,
  },
];

const JoinTheEconomy = () => (
  <div id="join" className="max-w-screen-lg lg:px-12 mx-auto lg:grid-cols-12 lg:pt-24 pt-12">
    <h2 className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-8`}>
      Join the Olas Predict Agent Economy
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agents.map((agent) => (
        <Card key={agent.title} className="rounded-2xl flex flex-col gap-6 p-6">
          <div className="flex gap-3">
            <Image
              src={`/images/predict-page/${agent.imgSrc}`}
              alt={agent.title}
              width={48}
              height={48}
            />
            <p className="font-medium text-lg my-auto">{agent.title}</p>
            <Image src={agent.chainSrc} alt={agent.chain} width={16} height={16} />
          </div>
          <p>{agent.description}</p>
          <div className="flex max-xl:flex-col xl:gap-3">
            <Button variant="default" asChild className="grow mt-6 max-md:w-full">
              <SubsiteLink isInButton href={agent.link}>
                Run {agent.title}
              </SubsiteLink>
            </Button>
            <Button variant="outline" asChild className="grow mt-6 max-md:w-full">
              {agent.isSecondaryLinkExternal ? (
                <a
                  className="text-purple-600 hover:text-purple-800 transition-colors duration-300 cursor-pointer"
                  href={agent.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More About {agent.title}
                </a>
              ) : (
                <Link href={agent.secondaryLink}>More About {agent.title}</Link>
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const eachCardCss = {
  background: 'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

const WhyOlasPredict = () => (
  <div
    id="why-predict-economy"
    className="max-w-screen-lg lg:px-12 mx-auto lg:grid-cols-12 lg:pt-24 pt-12"
  >
    <h2 className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-8`}>
      Why Olas Predict?
    </h2>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {olasPredictList.map(({ title, desc, icon }, index) => {
        return (
          <div
            key={title}
            className={`flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6`}
            style={eachCardCss}
          >
            <div className="flex items-center">
              {icon}
              <h2 className="text-xl font-semibold ml-2">{title}</h2>
            </div>

            <p className={TEXT_CLASS}>{desc}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export const WhatIsOlasPredict = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 border-y border border-b-0 border-x-0"
    id="what-is-olas-predict"
  >
    <WhatIs />
    <HowItWorks />
    <AgentRoles />
    <TheProcess />
    <JoinTheEconomy />
    <WhyOlasPredict />
  </SectionWrapper>
);
