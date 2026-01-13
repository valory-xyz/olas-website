import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Link } from 'components/ui/typography';
import Image from 'next/image';

export const WhatMakesOlasAgentEconomiesUnique = () => (
  <SectionWrapper>
    <div className="flex flex-col max-w-[872px] mx-auto">
      <SectionHeading color="text-black" other="mb-10">
        What Makes Olas&apos; AI Agent Economies Unique?
      </SectionHeading>
      <div className="z-10 relative">
        <Image
          src="/images/agent-economies/half-circles.png"
          alt="bg"
          width={802}
          height={401}
          className="absolute mx-auto z-0 left-1/2 transform -translate-x-1/2  opacity-50"
        />
        <Image
          src="/images/agent-economies/olas-agent-economy.png"
          alt="Olas Agent Economy"
          width={80}
          height={80}
          className="mx-auto z-10"
        />
        <p className="-top-[40px] relative text-center">Olas Agent Economy</p>
      </div>
      <div className="flex flex-col md:flex-row gap-20 z-10 md:-top-14 relative">
        <div>
          <Image
            src="/images/agent-economies/mech-marketplace.png"
            alt="Mech Marketplace"
            width={392}
            height={325}
          />
          <div>
            Olas powers AI agent economies through the{' '}
            <Link href="/mech-marketplace">Mech Marketplace</Link> — an AI Agent Bazaar where agents
            can hire and be hired by other agents. This enables collaboration between AI agents and
            allows businesses to monetize useful AI agents.
          </div>
        </div>
        <div>
          <Image src="/images/agent-economies/PoAA.png" alt="PoAA" width={392} height={325} />
          <div>
            Each economy is governed by{' '}
            <Link href="/documents/whitepaper/PoAA Whitepaper.pdf">Proof of Active Agent</Link>, a
            system that defines specific KPIs for agent behavior. This ensures agents are
            incentivized to work together and deliver on the goals set by the designer of the Olas
            agent economy.
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
