import { SUB_HEADER_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const CARD_BG =
  'border-1.5 border-gray-200 rounded-2xl py-6 bg-gradient-to-t from-[#F2F4F7] to-white max-md:px-3';

const WhatIsMech = () => (
  <div id="about">
    <h2 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      What is the Olas Mech agent economy?
    </h2>
    <Card className={`${CARD_BG} md:px-20 py-8 flex mb-8`}>
      <Image
        src="/images/mech-page/mech-diagram.png"
        alt="Mech diagram"
        width={920}
        height={595}
        className="mx-auto"
      />
    </Card>
    <div className="mb-3">
      The Olas Mech economy allows so-called{' '}
      <Link href="/agents/ai-mechs" className="text-purple-600">
        Mechs
      </Link>{' '}
      to sell AI tasks and other services to any agent or application that needs
      them via the blockchain. Mech agents provide things like intelligence or
      data to other agents by listening for on-chain requests and performing the
      needed actions off-chain, then delivering the results on-chain.{' '}
    </div>
    <p className="mb-20">
      This system creates a seamless marketplace for agents to procure and offer
      each others&apos; services: agents can request and receive specialized
      services through secure, decentralized transactions.
    </p>
  </div>
);

const TheProcess = () => (
  <div id="process">
    <h2 className={`${SUB_HEADER_LG_CLASS} text-left mb-8`}>The process</h2>
    <Card className={`${CARD_BG} max-w mb-8`}>
      <Image
        alt="The process"
        src="/images/mech-page/process.png"
        height={920}
        width={595}
        className="mx-auto"
      />
    </Card>
    <ol className="list-decimal ml-4 mb-2">
      <li className="mb-2">Autonomous agents request services from Mechs.</li>
      <li className="mb-2">
        Mechs leverage large language models (LLMs), external data, APIs, and
        other tools to serve requests.
      </li>
      <li className="mb-2">Mechs deliver results to requesting agents.</li>
    </ol>
    <p className="mb-2">The benefits:</p>
    <ol className="list-disc ml-4 mb-2">
      <li className="mb-2">
        Agents no longer need code upgrades: If an agent needs a skill it
        doesn&apos;t have it can use a Mech, bypassing the need for code
        changes.
      </li>
      <li className="mb-2">
        Choose from a variety of tools for your agent to level up skills such as
        optimizing DeFi asset management or predicting future events.
      </li>
      <li>
        Stop worrying about key management and get access to dozens of APIs and
        other data through one simple integration.
      </li>
    </ol>
  </div>
);

export const WhatIsOlasMech = () => (
  <SectionWrapper customClasses="mt-24 mx-auto max-w-[750px] max-sm:py-8 max-sm:px-6">
    <WhatIsMech />
    <TheProcess />
  </SectionWrapper>
);
