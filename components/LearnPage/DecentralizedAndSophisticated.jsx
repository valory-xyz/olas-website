import Image from 'next/image';

import { SCREEN_WIDTH_LG, SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const DecentralizedAndSophisticated = () => (
  <SectionWrapper customClasses="px-4 py-12 lg:px-24 lg:p-16">
    <div className={`${SCREEN_WIDTH_LG} gap-5 justify-center`}>
      <p className={`${SUB_HEADER_MEDIUM_CLASS} mb-6`}>
        What makes decentralized agents unique?
      </p>

      <Image
        src="/images/learn/Decentralized/what-are-autonomous-services.png"
        alt="What are autonomous services"
        className="mx-auto"
        width={575}
        height={522}
      />
    </div>
  </SectionWrapper>
);
