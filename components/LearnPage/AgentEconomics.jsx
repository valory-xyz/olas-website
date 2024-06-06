import Image from 'next/image';

import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const AgentEconomics = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <Image
        src="/images/learn/agent-economies.png"
        alt="Agent Economics"
        width={240}
        height={265}
        className="mb-8"
      />

      <h2 className={`${SUB_HEADER_CLASS} text-left mb-2`}>Agent Economics</h2>

      <div className="flex flex-col gap-4">
        <p>
          An Agent Economy consists of specialised agents – sovereign or
          decentralized – working together to provide complex services. Each
          agent performs specific tasks, and all of their interactions together
          deliver a powerful and flexible service.
        </p>

        <p>
          Applications of agent economies include AI prediction services,
          content generation, and financial services. The Olas protocol provides
          the necessary infrastructure to support these economies.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
