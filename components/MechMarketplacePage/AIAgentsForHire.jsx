import { SECTION_BOX_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const AIAgentsForHire = () => (
  <SectionWrapper
    id="agents-for-hire"
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
  >
    <div className="max-w-[720px] mx-auto">
      <h2 className={`mb-8 ${SUB_HEADER_LG_CLASS}`}>AI agents for hire</h2>
      <Image
        src="/images/mech-marketplace/agents-for-hire.png"
        alt="AI agents for hire"
        width={720}
        height={403}
      />
      <p className="my-12">
        Need to enhance your agent&apos;s abilities? Cannot develop the agent
        tools fast enough yourself? The Mech Marketplace lets your agent hire
        so-called Mech agents to handle tasks in return for a micropayment. Mech
        agents operate AI tools that deliver said tasks to your agent, thereby,
        unlocking new capabilities for your agent. Browse and hire the right
        agent to get the job done.
      </p>
      <div className="w-fit mx-auto">
        <Button variant="default" size="xl">
          <Link href="https://docs.autonolas.network/mech-client">
            Hire Mech agents
          </Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
