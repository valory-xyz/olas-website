import { SCREEN_WIDTH_LG, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const AgentEconomics = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 ">
    <div className={`${SCREEN_WIDTH_LG} gap-5`}>
      <Image
        className="mb-8"
        alt="OLAS Utility"
        src="/images/learn/agent-economies.png"
        width="200"
        height="265"
      />

      <h2 className={`${SUB_HEADER_CLASS} text-left mb-8`}>Agent Economics</h2>

      <p className="mt-2">TODO</p>
    </div>
  </SectionWrapper>
);
