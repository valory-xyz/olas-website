import { SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import Image from 'next/image';

export const TwoTypes = () => (
  <SectionWrapper>
    <SectionHeading other="text-center">
      Two Types of Olas Agents
    </SectionHeading>
    <div className="flex flex-col md:flex-row max-lg:gap-10 justify-between max-w-4xl mx-auto">
      <div className="flex flex-col gap-10 w-full md:max-w-[320px] lg:max-w-[396px] mx-auto">
        <h4 className={`text-center ${SUB_HEADER_MEDIUM_CLASS}`}>
          Sovereign Agents
        </h4>
        <Image
          src="/images/agents/sovereign-agents.png"
          alt="Sovereign Agents"
          width={396}
          height={200}
        />
        <p>
          Run by a single operator on a machine they control. Simple to deploy
          and self-custodied by the user.
        </p>
      </div>
      <div className="flex flex-col gap-10 w-full md:max-w-[320px] lg:max-w-[396px] mx-auto">
        <h4 className={`text-center ${SUB_HEADER_MEDIUM_CLASS}`}>
          Decentralized Agents
        </h4>
        <Image
          src="/images/agents/decentralized-agents.png"
          alt="Decentralized Agents"
          width={396}
          height={200}
        />
        <div>
          <p className="mb-3">
            Run by multiple operators and kept in sync through shared state and
            consensus.
          </p>
          <p>
            Suitable for use-cases where the agent should not be controlled by a
            single party.
          </p>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
