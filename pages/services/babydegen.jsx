import Image from 'next/image';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { Button } from 'components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import {
  ExternalLink, H1, Lead, Upcase,
} from 'components/ui/typography';

const BabyDegenHeader = () => (
  <SectionWrapper>
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <div className="mb-4">
          <Upcase>BABY DEGEN</Upcase>
        </div>
        <H1 className="mb-4">Taste the future of AI agent-powered trading</H1>
        <Lead className="mb-8">
          Take your first steps on your way to trading bliss.
        </Lead>
        <Button size="xl" disabled className="px-0">
          Coming soon
        </Button>
        <ExternalLink
          href="https://operate.olas.network/"
          className="block text-primary hover:text-primary-800 transition-colors duration-300"
        >
          Get started running another agent today
        </ExternalLink>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          src="/images/services/babydegen/babydegen.png"
          alt="Baby Degen"
          width={400}
          height={400}
          className="mx-auto rounded-lg"
        />
      </div>
    </div>
  </SectionWrapper>
);

const babyDegenInfo = "BabyDegen is your very own autonomous trading agent, designed to navigate the fast-paced world of DeFi. BabyDegen trades on your behalf leveraging various AI models and external data sources with speed and skill. It's more than just a tool; it's your companion on your crypto trading journey.";
const getReadyInfo = "BabyDegen is designed for anyone ready to embrace the future of autonomous trading. Whether you're looking to safeguard your edge in an evolving market or eager to explore trading without the steep learning curve, BabyDegen is your gateway to the next generation of effortless trading. Experience hands-free success with this cutting-edge solution.";
const WhatIsBabyDegen = () => (
  <SectionWrapper customClasses="border-y">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-24 mt-24">
        <H1 className="mb-4">What is BabyDegen?</H1>
        <Lead className="mb-8">{babyDegenInfo}</Lead>

        <H1 className="mb-4 mt-12">
          Get ready to participate in AI agent DeFi
        </H1>
        <Lead className="mb-8">{getReadyInfo}</Lead>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
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

const resources = [
  {
    title: 'Contribute a strategy',
    description:
      'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on discord',
    },
  },
  {
    title: 'Join as an Alpha tester',
    description: 'Keen on being at the forefront of trading innovation?',
    action: {
      url: 'https://discord.gg/RHY6eJ35ar',
      text: 'Reach out on discord',
    },
  },
];
const FurtherResources = () => (
  <SectionWrapper customClasses="border-y py-24">
    <div className="max-w-screen-lg mx-auto">
      <H1 className="text-center mb-12">Further resources</H1>
      <div className="grid md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <div key={index} className="mb-4 md:mb-0">
            <Card className="max-w-sm mx-auto h-full">
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[108px]">
                <CardDescription>{resource.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <a
                    href={resource.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-800 transition-colors duration-300"
                  >
                    {resource.action.text}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

const howItWorksSteps = [
  {
    title: 'Data Gathering',
    description: (
      <>
        BabyDegen pulls in market data from
        {' '}
        <ExternalLink
          href="https://www.coingecko.com/"
          target="_blank"
          className="underline underline-offset-4"
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
        trading activities are carried out on
        {' '}
        <ExternalLink
          href="https://jup.ag/"
          target="_blank"
          className="underline underline-offset-4"
          rel="noreferrer"
        >
          Jupiter Exchange
        </ExternalLink>
        {' '}
        on Solana.
      </>
    ),
    image: {
      path: '/images/services/babydegen/making-moves.png',
      alt: 'Making Moves',
    },
  },
];
const onceYouveFunded = "Once you've funded your account and activated BabyDegen, there's nothing more you need to do. But if you're curious about what happens behind the scenes, here's a closer look:";
const HowItWorks = () => (
  <SectionWrapper>
    <div className="max-w-screen-lg mx-auto">
      <H1 className="text-center mb-12">How it works</H1>

      <div className="grid grid-cols-3 gap-4">
        {howItWorksSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              src={step.image.path}
              alt={step.image.alt}
              width={240}
              height={240}
              className="mx-auto rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="text-xl list-decimal mb-6 pl-5 text-muted-foreground mt-12 mb-12">
        {onceYouveFunded}
      </div>

      <div className="max-w-4xl xl:pr-12 xl:pl-0 lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 px-5 lg:p-0">
          <ol className="text-xl list-decimal mb-6 pl-5 text-muted-foreground">
            {howItWorksSteps.map((step, index) => (
              <li key={index} className="mb-4">
                {step.title}
                {': '}
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="text-slate-500">
        BabyDegen is currently in closed Alpha
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
    <FurtherResources />
  </PageWrapper>
);

export default BabyDegen;
