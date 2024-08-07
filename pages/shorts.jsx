import Image from 'next/image';
import {
  LightbulbIcon,
  FastForwardIcon,
  CopyrightIcon,
  CircleDollarSign,
} from 'lucide-react';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { Button } from 'components/ui/button';
import { SHORTS_URL } from 'common-util/constants';

const HeroImage = () => (
  <Image
    src="/images/shorts-page/hero.png"
    alt="Contribute Hero"
    width={420}
    height={420}
  />
);

const Hero = () => (
  <SectionWrapper customClasses={`border-b ${SECTION_BOX_CLASS}`}>
    <div className="grid max-w-screen-xl items-center mx-auto lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-top xl:gap-0">
      <div className="md:mb-12 lg:mb-0 lg:col-span-6">
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2`}>SHORTS.WTF</div>
        <h2 className={`mb-4 ${MAIN_TITLE_CLASS}`}>
          Create a short film with just one prompt
        </h2>
        <div className="md:hidden mb-8">
          <HeroImage />
        </div>
        <div className={TEXT_SMALL_CLASS}>
          Start with an idea and get a complete AI agent-generated short film in
          30 minutes.
        </div>
        <Button
          asChild
          variant="default"
          size="xl"
          className="mt-6 w-full md:w-auto"
        >
          <a href={SHORTS_URL} rel="noopener noreferrer" target="_blank">
            Start creating now
          </a>
        </Button>
      </div>

      <div className="hidden sm:block col-span-1" />

      <div className="hidden lg:mt-0 lg:col-span-5 lg:flex md:block justify-end">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

const list = [
  {
    title: 'Start with an Idea',
    desc: "Don't worry about over-detailed scripting. Just enter your initial idea, and the intelligent agents do the rest, crafting a detailed narrative from your initial spark.",
    icon: <LightbulbIcon />,
  },
  {
    title: 'Get it in 30 minutes',
    desc: "From concept to film in just 30 minutes. Submit your idea, and Olas agents swiftly produce a complete short film complete with video and audio. It's rapid content creation without the wait.",
    icon: <FastForwardIcon />,
  },
  {
    title: 'Own it forever',
    desc: 'Your film, your rights—forever. Each film is minted as an NFT, granting you exclusive ownership and the freedom to showcase or sell your creation as you see fit.',
    icon: <CopyrightIcon />,
  },
  {
    title: 'Hassle-free payment',
    desc: 'Skip the multiple transactions. One simple crypto payment covers everything, making the process straightforward and seamless.',
    icon: <CircleDollarSign />,
  },
];
const TurnYourIdeas = () => (
  <SectionWrapper
    customClasses={SECTION_BOX_CLASS}
    id="turn-your-ideas-into-films"
  >
    <div className="grid max-w-screen-xl mx-auto items-start lg:px-12 lg:gap-8 lg:grid-cols-12">
      <div className="pr-0 lg:col-span-6 lg:pr-16">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>
          Turn your ideas into films with just one click
        </h2>

        <div className="flex flex-col gap-5">
          <p className={TEXT_CLASS}>
            From concept to complete film in just 30 minutes, Shorts.wtf uses
            autonomous AI agents that craft detailed narratives from your
            initial ideas and then turn them into short videos, including audio.
            Designed for creatives and professionals who need quick, compelling
            video content without thinking too much.
          </p>
        </div>
      </div>

      <div className="mt-4 lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          alt="OLAS Utility"
          src="/images/shorts-page/turn-your-ideas.png"
          width={500}
          height={212}
        />
      </div>
    </div>
  </SectionWrapper>
);

const Benefits = () => (
  <div className="max-w-screen-xl px-6 lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 mt-4">
    <h2
      className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
    >
      Benefits
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {list.map(({ title, desc, icon }) => (
        <div
          key={title}
          className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6"
          style={{
            background:
              'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
          }}
        >
          <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-semibold ml-2">{title}</h2>
          </div>

          <p className={TEXT_CLASS}>{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const getStartedList = [
  {
    id: '1',
    title: (
      <>
        <span className="font-bold">Visit</span>
        <a
          href={SHORTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600"
        >
          {' '}
          shorts.wtf↗
        </a>
        .
      </>
    ),
  },
  {
    id: '2',
    title: (
      <>
        <span className="font-bold">Connect</span>
        {' '}
        your wallet with xDAI.
      </>
    ),
  },
  {
    id: '3',
    title: <span className="font-bold">Enter your idea.</span>,
    description:
      'Type in your film concept or inspiration—no detail needed, just a starting point',
  },
  {
    id: '4',
    title: <span className="font-bold">Wait for 30 minutes.</span>,
    description:
      'Grab a coffee while the AI agents work their magic, transforming your idea into a complete short film.',
  },
  {
    id: '5',
    title: <span className="font-bold">Voila!</span>,
    description:
      'In no time, your film is ready to watch, share, or even sell.',
  },
];

const GetStarted = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} border-y border-t-0`}
    id="what-is-olas-contribute-service"
  >
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 lg:gap-8 lg:grid-cols-12 xl:gap-0">
      <div className="pb-0 pr-0 lg:col-span-6 lg:pr-12">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>Get started</h2>

        <div className="flex flex-col gap-5">
          <ol className="list-decimal ml-4">
            {getStartedList.map(({ id, title, description }) => (
              <li key={id} className="mb-1">
                {title}
                {description ? <p>{description}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex items-center justify-center lg:col-span-6">
        <div className="relative h-[294px] w-[316px] ">
          <Image
            alt="OLAS Utility"
            src="/images/shorts-page/cta-background.png"
            width={316}
            height={294}
          />
          <Button
            asChild
            variant="default"
            size="lg"
            className="absolute w-[200px] top-[132px] left-1/2 -translate-x-1/2"
          >
            <a href={SHORTS_URL} rel="noopener noreferrer" target="_blank">
              Start creating now
            </a>
          </Button>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const Shorts = () => (
  <PageWrapper>
    <Meta pageTitle="Shorts" description="TODO" />
    <Hero />
    <TurnYourIdeas />
    <Benefits />
    <GetStarted />
  </PageWrapper>
);

export default Shorts;
