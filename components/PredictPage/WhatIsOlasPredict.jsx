// import { Fragment } from 'react';

import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

// const childUlClass = 'ml-4 mt-1 list-disc list-inside';

const WhatIs = () => (
  <div className={`${SCREEN_WIDTH_LG} gap-5 pb-20`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>What is Olas Predict?</h2>

    <p>
      Olas Predict leverages autonomous agents to create a seamless and
      cost-effective prediction market ecosystem. By utilizing advanced
      technology and eliminating human participation costs, it has generated
      significant transaction activity on the Gnosis Chain. Its predictions are
      currently focused on current events.
    </p>
  </div>
);

const HowItWorks = () => (
  <div className={`${SCREEN_WIDTH_LG} gap-5`}>
    <h2 className={`${SUB_HEADER_CLASS} mb-2`}>How It Works</h2>

    <p>
      In simple terms, Predict delivers predictions through the trading activity
      of agents on prediction markets.
    </p>

    <Image
      src="/images/predict-page/how-it-works.png"
      // width={1200} height={800}
      alt="How it works"
      width={800}
      height={200}
    />
  </div>
);

const AgentRoles = () => {
  const agentRolesList = [
    {
      img: 'market-creators',
      title: 'Creator',
      desc: (
        <>
          Deploy and seed prediction markets using the prediction market
          protocols, specifically Omen↗.
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

  return (
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>Agent Roles</h2>

      <Image
        src="/images/predict-page/agent-roles.png"
        // width={1200} height={800}
        alt="How it works"
        width={800}
        height={200}
      />

      {agentRolesList.map(({ img, title, desc }, index) => (
        <div key={index} className="flex gap-5 flex-col">
          <Image
            src={`/images/predict-page/${img}.png`}
            alt={title}
            width={100}
            height={100}
          />

          <div>
            <h3 className="font-bold">{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const TheProcess = () => {
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

  return (
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-2`}>The Process</h2>

      <Image
        src="/images/predict-page/the-process.png"
        // width={1200} height={800}
        alt="How it works"
        width={800}
        height={200}
      />

      <ol className="list-decimal list-inside">
        {processList.map(({ title, desc }, index) => (
          <li key={index} className="mb-1">
            <span className="font-bold">{`${title}: `}</span>
            <span>{desc}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const WhatIsOlasPredict = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 border-y"
    id="what-is-olas-predict"
  >
    <WhatIs />
    <HowItWorks />
    <AgentRoles />
    <TheProcess />
  </SectionWrapper>
);
