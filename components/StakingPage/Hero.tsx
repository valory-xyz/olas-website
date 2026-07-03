import { MAIN_TITLE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const Hero = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-b-1.5" backgroundType="GRAY_GRADIENT">
    <div className="flex flex-col items-center">
      <Image
        src="/images/staking-page/staking.png"
        alt="OLAS"
        width={286}
        height={99}
        className="mb-[72px]"
      />
      <h1 className={`${MAIN_TITLE_CLASS} xl:mb-6`}>Olas Staking</h1>
      <span>The Engine of the Agentic Economy.</span>
      <span className="mt-2 text-sm text-gray-500 text-center">
        Staking rewards depend on agent activity and are not guaranteed. OLAS is a crypto asset —
        its value can go down as well as up.
      </span>
    </div>
  </SectionWrapper>
);
