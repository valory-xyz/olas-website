import { SUB_HEADER_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';

const CARD_BG =
  'border-1.5 border-gray-200 rounded-2xl p-6 bg-gradient-to-t from-[#F2F4F7] to-white';

const types = [
  {
    id: 'Trader',
    src: '/images/predict-page/traders.png',
    desc: 'Finds the best DeFi opportunities and makes smart investments.',
    linkText: 'More about Trader agents ',
    link: '',
  },
  {
    id: 'Mech',
    src: '/images/predict-page/mechs.png',
    desc: 'Operating as Olas Mech agent economy, Mechs provide intelligence for Trader agents for managing DeFi assets.',
    linkText: 'More about Olas Mech agent economy ',
    link: '',
  },
];

const WhatIsOptimus = () => (
  <div>
    <h1 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      What is Olas Optimus?
    </h1>
    <p className="mb-20">
      Olas Optimus agent economy is a multi-agent system of autonomous AI agents
      to streamline your DeFi experience. An autonomous AI agent intelligently
      manages your assets on specific blockchain platforms. <br />
      It strategically targets high-yield opportunities, optimizing your returns
      within ecosystems like Optimism Mainnet and Base.
    </p>
  </div>
);

const AgentTypes = () => (
  <>
    <h2 className="text-left text-2xl font-semibold tracking-tight my-3">
      Agent types
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 my-6">
      {types.map((item, index) => {
        let borderClassName = 'pr-6';
        if (index % 2 !== 0) borderClassName = ' md:border-l-1.5 pl-6';

        return (
          <div
            key={item.id}
            className={`flex flex-col gap-3 mb-3 text-start w-[350px] border-gray-300 h-full max-sm:w-full ${borderClassName}`}
          >
            <Image alt="Optimus" src={item.src} width="72" height="32" />
            <span className="text-xl font-semibold text-black">{item.id}</span>
            <p>{item.desc}</p>

            <a
              href={item.link}
              className="mt-auto text-purple-600"
              target="_blank"
            >
              {item.linkText} ↗
            </a>
          </div>
        );
      })}
    </div>
  </>
);

const TheProcess = () => (
  <div>
    <h2 className={`${SUB_HEADER_LG_CLASS} text-left mb-8`}>The process</h2>
    <Card className={`${CARD_BG} max-h-[250px] p-8 max-w mb-8`}>
      <Image
        alt="The process"
        src="/images/optimus-page/process.png"
        height={126}
        width={546}
        className="mx-auto"
      />
    </Card>
    <p className="mb-3">Every 24 hours, Optimus follows a simple cycle:</p>
    <ol className="list-decimal">
      <li className="mb-2">
        <strong>Finds the best opportunities:</strong>
        <p>
          It looks for liquidity pools on{' '}
          <a
            href="https://merkl.angle.money/"
            className="text-purple-600 underline"
          >
            Merkl↗
          </a>
          , targeting those on Balancer and Uniswap with an Annual Percentage
          Rate (APR) higher than 5%.
        </p>
      </li>
      <li>
        <strong>Makes smart investments:</strong>
        <ol className="list-[lower-alpha] mb-2 ml-4">
          <li className="py-1">
            If it&apos;s the first investment and the pool&apos;s Annual
            Percentage Rate (APR) is over 5%, Optimus adds liquidity.
          </li>
          <li className="py-1">
            If it finds a pool with a higher APR than your current one, Optimus
            moves your assets to maximize your earnings.
          </li>
          <li className="py-1">
            {' '}
            If no opportunity is available, it waits until the next period and
            restarts the cycle.
          </li>
        </ol>
      </li>
      <li>
        <strong>Tracks performance:</strong>
        <p>
          By keeping track of the number of transactions performed on the
          Optimism chain, Optimus contributes to your Key Performance Indicators
          (KPIs) for Olas staking rewards. This means that if you run Optimus
          daily, you earn staking rewards based on your agent’s activity.
        </p>
      </li>
    </ol>
  </div>
);

export const WhatIsOlasOptimus = () => (
  <SectionWrapper customClasses="px-6 mx-auto max-w-screen-sm">
    <WhatIsOptimus />
    <AgentTypes />
    <TheProcess />
  </SectionWrapper>
);
