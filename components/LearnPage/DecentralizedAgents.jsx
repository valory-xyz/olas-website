import Image from 'next/image';

import { SCREEN_WIDTH_LG, SUB_HEADER_LG_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const DecentralizedAgents = () => (
  <SectionWrapper customClasses="px-4 py-12 lg:px-24 lg:p-16">
    <div className={`${SCREEN_WIDTH_LG} gap-5 justify-center`}>
      <Image
        src="/images/learn/decentralized-agents.png"
        alt="Decentralized Agents"
        width={200}
        height={265}
        className="mb-8"
      />
      <p className={`${SUB_HEADER_LG_CLASS} mb-2`}>Decentralized Agents</p>

      <div className="flex flex-col gap-4">
        <p>
          Decentralized Agents are made up of multiple agent instances, each run
          by different operators. This setup ensures high transparency and
          robustness due to open-source code and a consensus mechanism that
          keeps all agent instances in sync.
        </p>

        <p>
          These agent instances and its operator are well-suited for managing
          high-value processes and assets, such as governance in DAOs or
          delivering AI inference on-chain, because they minimize reliance on
          any single operator.
        </p>

        <p>
          In Olas&apos; technical language, decentralized agents are referred to
          as &quot;autonomous services with multiple agent instances&quot;.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
