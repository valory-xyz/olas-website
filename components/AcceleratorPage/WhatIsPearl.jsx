import { SUB_HEADER_CLASS } from 'common-util/classes';
import { ACCELERATOR_APPLY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    icon: '/images/accelerator/usdc-icon.png',
    title: 'Get funded',
    description: (
      <>
        Secure up to <strong>$100K</strong> in milestone-based grants to develop
        your AI agent.
      </>
    ),
  },
  {
    icon: '/images/olas-token-logo.png',
    title: 'Earn OLAS rewards',
    description: (
      <>
        Receive ongoing <strong>OLAS Dev Rewards</strong> for your registered
        agent.
      </>
    ),
  },
  {
    icon: '/images/accelerator/life-buoy.png',
    title: 'Get support',
    description: 'Get resources & support to help you grow.',
  },
];

const Only10Teams = () => (
  <div className="max-w-[720px] mx-auto flex flex-col gap-4 mb-12 md:mb-20">
    <h2 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-12`}>
      Only 10 teams will secure funding — is it yours?
    </h2>
    <p>
      The Olas Accelerator is awarding $1M (USDC) in grants + OLAS Dev Rewards
      to developers building AI Agents for Pearl — The Agent App Store. The top
      10 teams will receive milestone-based funding to develop, launch, and
      scale their agents. Spots are limited —{' '}
      <ExternalLink href={ACCELERATOR_APPLY_URL}>apply today</ExternalLink>!
    </p>
  </div>
);

const DisplaySteps = () => (
  <div className="flex flex-col md:flex-row mx-auto xl:px-8 max-w-5xl justify-between max-md:gap-y-4 mb-12 md:mb-20">
    {steps.map((item, index) => (
      <Card
        key={index}
        className="md:w-[305px] p-5 flex flex-col mx-auto gap-4"
      >
        <Image src={item.icon} alt={item.title} width={64} height={64} />
        <p className="text-xl font-semibold">{item.title}</p>
        <div className="inline">{item.description}</div>
      </Card>
    ))}
  </div>
);

const Pearl = () => (
  <div className="max-w-[964px] mx-auto max-sm:flex-col flex justify-between">
    <div className="flex flex-col gap-4 max-w-[470px]">
      <h2 className={`${SUB_HEADER_CLASS} font-semibold mb-2`}>
        What is Pearl
      </h2>
      <p>
        Pearl is the “App Store” for AI Agents, allowing anyone to run an AI
        Agent on their laptop. These AI Agents operate autonomously, completing
        tasks and earning potential rewards.
      </p>
      <p>
        You can build and launch an agent on Pearl — so others can run it and
        benefit from it.
      </p>

      <Link href="/operate" className="text-purple-600">
        Explore AI Agents available on Pearl
      </Link>
    </div>
    <Image
      src="/images/accelerator/agents.png"
      alt="AI Agents"
      width={364}
      height={232}
      className="object-contain mt-8"
    />
  </div>
);

export const WhatIsPearl = () => (
  <SectionWrapper>
    <Only10Teams />
    <DisplaySteps />
    <Pearl />
  </SectionWrapper>
);
