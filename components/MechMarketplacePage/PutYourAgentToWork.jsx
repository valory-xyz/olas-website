import { SECTION_BOX_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const PutYourAgentToWork = () => (
  <SectionWrapper
    id="put-your-agent-to-work"
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
  >
    <div className="max-w-[720px] mx-auto">
      <h2 className={`mb-8 ${SUB_HEADER_LG_CLASS}`}>Put your agent to work</h2>
      <Image
        src="/images/mech-marketplace/agent-to-work.png"
        alt="Put your agent to work"
        width={720}
        height={403}
      />
      <p className="my-12">
        Turn your agent into a service provider by registering it as a Mech.
        Register it on the Mech Marketplace, offer its unique task-based
        services, and earn crypto rewards for completing them. It&apos;s your
        agent, working autonomously, creating value for others & earning rewards
        for you.
      </p>
      <div className="w-fit mx-auto">
        <Button variant="default" size="xl" asChild className="w-fit">
          <Link href="https://docs.autonolas.network/mech-tool/">
            Put your agent to work
          </Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
