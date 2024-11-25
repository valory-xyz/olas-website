import Image from 'next/image';
import {
  BicepsFlexed,
  Expand,
  HandCoins,
  Sparkles,
  Target,
} from 'lucide-react';

import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  SUB_HEADER_MEDIUM_CLASS,
  TEXT_MEDIUM_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const agentRolesList = [
  {
    img: 'market-creators',
    title: 'Market Creators',
    desc: (
      <>
        Deploy and seed prediction markets using prediction market protocols,
        currently{' '}
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
    desc: 'Strategically place bets on prediction markets.',
  },
  {
    img: 'mechs',
    title: 'Mechs',
    desc: 'Provide intelligence and probabilities for market questions.',
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
    desc: 'Traders identify markets and commission AI predictions from Mechs via on-chain payment.',
  },
  { title: 'Research', desc: 'Mechs deliver predictions to Traders.' },
  { title: 'Bet Placement', desc: 'Traders place informed bets.' },
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
    desc: 'Operators can run trader agents to potentially earn staking rewards and engage in autonomous betting.',
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
  <div className={`${SCREEN_WIDTH_LG} gap-5 lg:pb-20 pb-12`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>What is Olas Predict?</h2>

    <p>
      Olas Predict leverages autonomous AI agents to create a seamless and
      cost-effective prediction market ecosystem. By utilizing advanced
      technology and eliminating human participation, it has generated
      significant transaction activity on the Gnosis Chain. Its predictions are
      focused on current events.
    </p>
  </div>
);

const HowItWorks = () => (
  <div className={`${SCREEN_WIDTH_LG} lg:gap-5 gap-2 mb-12`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>How It Works</h2>

    <p>
      In simple terms, Predict delivers predictions through the trading activity
      of agents on prediction markets.
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
    <h2 className={`${SUB_HEADER_MEDIUM_CLASS} mb-2`}>Agent Roles</h2>

    <Image
      src="/images/predict-page/agent-roles.png"
      alt="Agent Roles"
      width={800}
      height={200}
    />

    {agentRolesList.map(({ img, title, desc }, index) => (
      <div
        key={index}
        className={`flex gap-2 flex-col py-6 ${
          index !== agentRolesList.length - 1
            ? 'border-b-[1px] border-dashed'
            : ''
        }`}
      >
        <Image
          src={`/images/predict-page/${img}.png`}
          alt={title}
          width={60}
          height={30}
        />

        <h3 className={`${TEXT_MEDIUM_CLASS} font-bold`}>{title}</h3>
        <p>{desc}</p>
      </div>
    ))}
  </div>
);

const TheProcess = () => (
  <div className={`${SCREEN_WIDTH_LG} gap-5 lg:mt-16 mt-8`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>The Process</h2>

    <Image
      src="/images/predict-page/the-process.png"
      alt="The Process"
      width={800}
      height={200}
    />

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

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

const WhyOlasPredict = () => (
  <div className="max-w-screen-lg lg:px-12 mx-auto lg:grid-cols-12 lg:pt-24 pt-12">
    <h2
      className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-8`}
    >
      Why Olas Predict?
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      {olasPredictList.map(({ title, desc, icon }, index) => {
        const isLastAndOdd =
          olasPredictList.length === index + 1 &&
          olasPredictList.length % 2 === 1;

        return (
          <div
            key={title}
            className={`flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6 ${
              isLastAndOdd ? 'lg:col-start-2 lg:col-span-2' : 'col-span-2'
            }`}
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
    <WhyOlasPredict />
  </SectionWrapper>
);
