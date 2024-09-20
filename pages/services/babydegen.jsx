/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { Button } from 'components/ui/button';
import { ExternalLink, H1 } from 'components/ui/typography';
import { OPERATE_AGENTS_URL } from 'common-util/constants';
import {
  MAIN_TITLE_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import { MoveUpRight } from 'lucide-react';

const HeaderLeftContent = () => (
  <div className="lg:col-span-6 px-5 lg:p-0 lg:text-left w-auto mb-12">
    <div className={TEXT_MEDIUM_LIGHT_CLASS}>BABY DEGEN</div>
    <H1 className={`${MAIN_TITLE_CLASS} mb-6 lg:w-5/6`}>
      Taste the future of AI agent-powered trading
    </H1>

    <p className={`${TEXT_SMALL_CLASS} mb-8`}>
      Take your first steps on your way to trading bliss.
    </p>

    <div className="flex flex-wrap justify-stretch gap-6">
      <Button variant="secondary" size="xl" disabled className="grow lg:w-auto">
        Coming soon
      </Button>

      <Button
        variant="ghostPrimary"
        size="xl"
        asChild
        className="grow lg:w-auto "
      >
        <a href={OPERATE_AGENTS_URL}>Explore other agents today</a>
      </Button>
    </div>
  </div>
);

const HeaderRightContent = () => (
  <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
    <Image
      src="/images/services/babydegen/babydegen.png"
      alt="Baby Degen"
      width={400}
      height={400}
      className="mx-auto rounded-lg"
    />
  </div>
);

const BabyDegenHeader = () => (
  <SectionWrapper customClasses="border-y">
    <div className="max-w-screen-xl xl:gap-0 lg:gap-8 lg:grid-cols-12 lg:px-16 grid mx-auto my-24 items-center">
      <HeaderLeftContent />
      <HeaderRightContent />
    </div>
  </SectionWrapper>
);

const WhatIsBabyDegen = () => (
  <SectionWrapper>
    <div className="grid max-w-screen-xl lg:px-16 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left lg:w-6/7">
        <h1 className={`${SUB_HEADER_CLASS} mb-8`}>What is BabyDegen?</h1>
        <p className="mb-20">
          BabyDegen is your very own autonomous trading agent, designed to
          navigate the fast-paced world of DeFi. BabyDegen trades on your behalf
          leveraging various AI models and external data sources with speed and
          skill. It's more than just a tool; it's your companion on your crypto
          trading journey.
        </p>

        <h1 className={`${SUB_HEADER_CLASS} mb-8`}>
          Get ready to participate in AI agent DeFi
        </h1>
        <p className="mb-8">
          BabyDegen is designed for anyone ready to embrace the future of
          autonomous trading. Whether you're looking to safeguard your edge in
          an evolving market or eager to explore trading without the steep
          learning curve, BabyDegen is your gateway to the next generation of
          effortless trading. Experience hands-free success with this
          cutting-edge solution.
        </p>
      </div>

      <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
        <Image
          src="/images/services/babydegen/participate.webp"
          alt="Get ready to participate in AI agent DeFi"
          width={400}
          height={400}
          className="mx-auto rounded-lg"
        />
      </div>
    </div>
  </SectionWrapper>
);

const MeetTheOptimusAgent = () => (
  <SectionWrapper customClasses="lg:p-24 border-y border-[#FFE0E6] w-full h-full bg-gradient-to-r from-[#FFF0F1] to-white to-70%">
    <div className="px-8 py-12 lg:p-0 grid max-w-screen-xl lg:px-16 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left lg:w-6/7">
        <h1 className={`${SUB_HEADER_CLASS} mb-8 mt-12`}>
          Meet the Optimus agent: a step towards BabyDegen
        </h1>
        <p className="mb-8">
          The Optimus Agent is an autonomous AI agent that streamlines your DeFi
          experience by intelligently managing your assets on specific
          blockchain platforms. Initially focused on select DeFi protocols on
          Optimism Mainnet and Base, it offers a targeted approach to maximizing
          returns within these ecosystems.
        </p>
        <p className="mb-8">
          The Optimus Agent is currently in alpha testing via Quickstart and
          currently supports key protocols like Balancer and Uniswap. It’s
          operational on Ethereum, Base, and Optimism. Looking ahead, it will
          expand to support any protocol that wishes to integrate.
        </p>
      </div>

      <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
        <Image
          src="/images/services/babydegen/optimus.png"
          alt="Get ready to participate in AI agent DeFi"
          width={400}
          height={400}
          className="mx-auto rounded-lg"
        />
      </div>
    </div>
  </SectionWrapper>
);

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on Discord',
    },
  },
  {
    title: 'Join as an Alpha tester',
    description: 'Keen on being at the forefront of trading innovation?',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on Discord',
    },
  },
];

const FurtherResources = () => (
  <SectionWrapper>
    <h2 className={`${SUB_HEADER_CLASS} text-center lg:mb-14 text-left mb-6 `}>
      Further resources
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-screen-lg mx-auto">
      {resources.map((resource, index) => (
        <div
          key={index}
          className="lg:p-6 align flex flex-col gap-2 p-4 rounded-xl border border-l-4"
        >
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{resource.title}</h2>
          </div>

          <p className={`${TEXT_CLASS} flex-1`}>{resource.description}</p>

          <a
            href={resource.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 flex-end"
          >
            {resource.action.text}{' '}
            <MoveUpRight className="ml-2 inline" size={16} />
          </a>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

const howItWorksSteps = [
  {
    title: 'Data Gathering',
    description: (
      <>
        BabyDegen pulls in market data from{' '}
        <ExternalLink
          href="https://www.coingecko.com/"
          target="_blank"
          rel="noreferrer"
        >
          CoinGecko
        </ExternalLink>
        , ensuring it has the latest information at its fingertips.
      </>
    ),
    image: {
      path: '/images/services/babydegen/data-gathering.png',
      alt: 'Data Gathering',
    },
  },
  {
    title: 'Strategy Selection',
    description: (
      <>
        Thanks to a vast and ever-expanding library of trading strategies from
        ecosystem developers, BabyDegen is adept at learning. It autonomously
        determines which strategies are most effective under various market
        conditions.
      </>
    ),
    image: {
      path: '/images/services/babydegen/strategy-selection.png',
      alt: 'Data Gathering',
    },
  },
  {
    title: 'Making Moves',
    description: (
      <>
        Based on its accumulated experience and the real-time market data,
        BabyDegen decides whether to buy, sell, or hold specific assets. All
        trading activities are carried out on{' '}
        <ExternalLink href="https://jup.ag/" target="_blank" rel="noreferrer">
          Jupiter Exchange
        </ExternalLink>{' '}
        on Solana.
      </>
    ),
    image: {
      path: '/images/services/babydegen/making-moves.png',
      alt: 'Making Moves',
    },
  },
];
const HowItWorks = () => (
  <SectionWrapper>
    <div className="max-w-screen-lg mx-auto lg:px-50">
      <h1 className={`${SUB_HEADER_CLASS} mb-12 text-center`}>How it works</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {howItWorksSteps.map(({ image }, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={image.path}
              alt={image.alt}
              width={180}
              height={180}
              className="mx-auto rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="lg:mx-16">
        <div className="list-decimal mb-6 mt-12 mb-12">
          Once you've funded your account and activated BabyDegen, there's
          nothing more you need to do. But if you're curious about what happens
          behind the scenes, here's a closer look:
        </div>

        <div className=" lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 lg:p-0">
            <ol className="list-decimal mb-6 pl-5">
              {howItWorksSteps.map(({ title, description }, index) => (
                <li key={index} className="mb-4">
                  <span className="font-bold">{title}</span>
                  {': '}
                  {description}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="text-slate-500">
          BabyDegen is currently in closed Alpha
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const BabyDegen = () => (
  <PageWrapper>
    <Meta
      pageTitle="BabyDegen"
      siteImageUrl="/images/services/babydegen/babydegen.png"
    />
    <BabyDegenHeader />
    <WhatIsBabyDegen />
    <HowItWorks />
    <MeetTheOptimusAgent />
    <FurtherResources />
  </PageWrapper>
);

export default BabyDegen;
