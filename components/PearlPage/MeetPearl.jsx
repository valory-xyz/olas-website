import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS, TEXT_CLASS } from './utils';

export const MeetPearlContent = () => (
  <div className="h-[540px] max-w-[1096px] sm:h-auto mt-10 mx-auto flex flex-col lg:flex-row gap-8 justify-between">
    <div className="lg:max-w-[410px] lg:text-left">
      <h2
        className={`${SUB_HEADER_CLASS} mb-4 font-semibold lg:mb-6 flex gap-3 items-center`}
      >
        Discover{' '}
        <Image
          alt="Operate Logo"
          src="/images/pearl-page/pearl-thumbnail.png"
          width={48}
          height={48}
        />{' '}
        Pearl
      </h2>

      <p className={TEXT_CLASS}>
        Pearl brings you the ultimate collection of AI agents in one app —
        Pearl, your &quot;AI Agent App Store&quot;. From asset managers to
        custom AI influencers, Pearl has it all. Choose from a growing range of
        Olas agents you can own: stake OLAS, and let them work autonomously for
        {'  '}
        <i>you</i>, earning you potential rewards from your crypto agents&apos;
        work and Olas Staking.
      </p>
    </div>
    <Image
      alt="Meet Pearl"
      src="/images/pearl-page/select-your-agent.webp"
      width={630}
      height={489}
      className="mx-auto"
    />
  </div>
);

export const MeetPearl = () => (
  <SectionWrapper
    id="about"
    customClasses={`${SECTION_BOX_CLASS} max-md:mb-12`}
  >
    <MeetPearlContent />
  </SectionWrapper>
);
