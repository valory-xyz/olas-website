import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import Image from 'next/image';

export const WhatIsAnAiAgent = () => (
  <SectionWrapper>
    <div className="flex flex-col max-w-[648px] mx-auto">
      <SectionHeading other="text-center">What is an AI Agent?</SectionHeading>
      <Image
        src="/images/agents/ai-agent.png"
        alt="What is an AI Agent?"
        width={648}
        height={228}
        className="mb-10"
      />
      <p>
        An AI agent is a software system that perceives its environment, makes decisions, and takes
        actions autonomously — without continuous human input — to achieve specific goals.
      </p>
    </div>
  </SectionWrapper>
);
