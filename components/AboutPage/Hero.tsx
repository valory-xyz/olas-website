import { MAIN_TITLE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const Hero = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-b-1.5" backgroundType="GRAY_GRADIENT">
    <div className="flex flex-col items-center">
      <Image
        src="/images/about/olas.svg"
        alt="OLAS"
        width={154}
        height={120}
        className="mb-[72px]"
      />
      <h1 className={`${MAIN_TITLE_CLASS} xl:mb-6`}>Olas: Co-own AI</h1>
      <span>Olas enables everyone to own & monetize their AI Agents</span>
    </div>
  </SectionWrapper>
);
