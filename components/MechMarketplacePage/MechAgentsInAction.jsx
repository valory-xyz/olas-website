import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const MechAgentsInAction = () => (
  <SectionWrapper
    customClasses={`border-b bg-gradient-to-t from-slate-200 to-slate-50 ${SECTION_BOX_CLASS}`}
  >
    <div className="mx-auto max-w-6xl text-center">
      <h2 className={`mb-12 ${SUB_HEADER_CLASS}`}>
        Mech agents in action - Eolas AI
      </h2>
      <Image
        src="/images/mech-marketplace/eolas-AI.png"
        alt="Mech agents in action - Eolas AI"
        width={1122}
        height={601}
      />
    </div>
  </SectionWrapper>
);
