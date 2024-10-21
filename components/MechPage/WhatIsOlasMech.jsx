import { SUB_HEADER_CLASS, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';

const CARD_BG =
  'border-1.5 border-gray-200 rounded-2xl py-6 bg-gradient-to-t from-[#F2F4F7] to-white max-md:px-3';

const WhatIsMech = () => (
  <div>
    <h1 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      What is the Olas Mech agent economy?
    </h1>
    <Card className={`${CARD_BG} md:px-20 py-8 flex mb-8`}>
      <Image
        src="/images/mech-page/mech-diagram.png"
        alt="Mech diagram"
        width={920}
        height={595}
        className="mx-auto"
      />
    </Card>
    <p className="mb-3">
      The Mech economy sells AI services to other agents via the blockchain.
      Building on this concept, Olas Mech agent economy provides AI intelligence
      for other autonomous AI agents or agent economies by listening for
      on-chain requests and performing the needed actions off-chain in exchange.{' '}
    </p>
    <p className="mb-20">
      This system creates a seamless marketplace for AI capabilities, where
      agents can request and receive specialized services through secure,
      decentralized transactions.
    </p>
  </div>
);

const TheProcess = () => (
  <div>
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
    <ol className="list-decimal">
      <li className="mb-2">
        Autonomous AI agents can request information from Mechs.
      </li>
      <li className="mb-2">
        Mechs then leverage large language models (LLMs) and other AI
        technologies, using both open-source and closed models, to analyze
        requests and provide a meaningful output.
      </li>
      <li className="mb-2">
        hese insights guide agents in making smarter decisions, such as
        optimizing DeFi asset management or predicting future events.
      </li>
      <li>
        By continuously interacting with AI models, Mechs streamline agent
        activities, ultimately contributing to KPIs and boosting performance
        within the Olas ecosystem.
      </li>
    </ol>
  </div>
);

export const WhatIsOlasMech = () => (
  <SectionWrapper customClasses="mx-auto max-w-[750px] max-sm:py-8 max-sm:px-6">
    <WhatIsMech />
    <TheProcess />
  </SectionWrapper>
);
