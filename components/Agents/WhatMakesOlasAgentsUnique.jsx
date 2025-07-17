import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import Image from 'next/image';

export const WhatMakesOlasAgentsUnique = () => (
  <SectionWrapper>
    <div className="flex flex-col max-w-[1320px] mx-auto text-center">
      <SectionHeading>What Makes Olas&apos; AI Agents Unique?</SectionHeading>
      <p className="mb-10">
        Olas agents are autonomous AI agents that satisfy these additional
        characteristics:
      </p>
      <Image
        src="/images/agents/unique-agents.png"
        alt="What Makes Olas' AI Agents Unique?"
        width={1320}
        height={1086}
      />
    </div>
  </SectionWrapper>
);
