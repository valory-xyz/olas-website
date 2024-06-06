import Image from 'next/image';

import {
  SCREEN_WIDTH_LG,
  SUB_HEADER_CLASS,
  SUB_HEADER_LG_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const SovereignAgents = () => (
  <SectionWrapper
    customClasses="px-4 py-12 border-y lg:px-24 lg:p-16 border-t"
    id="sovereign-agents"
  >
    <div className={`${SCREEN_WIDTH_LG} gap-6 justify-center`}>
      <h2
        className={`${SUB_HEADER_CLASS} mb-12 self-center max-w-[540px] md:text-center`}
      >
        What different types of system can be build on Olas?
      </h2>

      <Image
        className="mb-8"
        alt="Sovereign Agents"
        src="/images/learn/sovereign-agents.png"
        width={200}
        height={145}
      />
      <p className={`${SUB_HEADER_LG_CLASS} mb-0`}>Sovereign Agents</p>

      <div className="flex flex-col gap-4">
        <p>
          Sovereign agents are lightweight, easy-to-run agents managed by a
          single individual or entity. They can operate on a personal computer
          or in the cloud, offering flexibility in deployment.
        </p>

        <p>
          The main advantages of Sovereign agents include low operating cost and
          simplicity, making them ideal for personal tasks or smaller-scale
          operations without the need for extensive coordination. In Olas&apos;
          technical language, sovereign agents are referred to as
          &quot;autonomous services with a single agent instance&quot;.
        </p>
      </div>
    </div>
  </SectionWrapper>
);
