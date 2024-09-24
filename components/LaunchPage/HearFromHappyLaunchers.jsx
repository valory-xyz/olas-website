import Image from 'next/image';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';

const TweetHeader = () => (
  <div className="flex items-start gap-4 md:items-center">
    <a
      href="https://x.com/koeppelmann"
      target="_blank"
      rel="noreferrer"
      className="rounded-full cursor-pointer"
    >
      <Image
        src="/images/launch-page/testimony-avatar.png"
        alt="avatar"
        width={48}
        height={48}
      />
    </a>

    <div>
      <h3 className="font-bold">
        Martin Köppelmann, Co-Founder and CEO of Gnosis
      </h3>
      <ExternalLink
        href="https://x.com/koeppelmann"
        className="text-sm text-slate-500"
        hideArrow
      >
        @koeppelmann
      </ExternalLink>
    </div>

    <a
      href="https://gnosis.io"
      target="_blank"
      rel="noreferrer"
      className="ml-auto rounded-full cursor-pointer"
    >
      <Image
        src="/images/launch-page/gnosis-logo.svg"
        alt="gnosis"
        width={48}
        height={48}
      />
    </a>
  </div>
);

const TweetBody = () => (
  <p>
    Another big user has been AI agents by{' '}
    <ExternalLink href="https://x.com/autonolas" hideArrow>
      @autonolas
    </ExternalLink>
    {' - '}
    we have this ongoing challenge where agents gather information and trade on
    prediction markets - this has lead to the majority of{' '}
    <ExternalLink href="https://x.com/safe" hideArrow>
      @safe
    </ExternalLink>{' '}
    transaction on Gnosis been executed by agents!
  </p>
);

const TweetFooter = () => (
  <div className="flex justify-between items-center">
    <div className="text-sm text-slate-500">
      10:16 AM · Nov 15, 2023 ·{' '}
      <span className="text-black font-semibold">7,268</span> Views
    </div>

    <ExternalLink
      href="https://x.com/koeppelmann/status/1724702884304998626"
      className="!text-black"
    >
      View post on X
    </ExternalLink>
  </div>
);

export const HearFromHappyLaunchers = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-20 mt-20 bg-gray-100 border-y"
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 0%, #E7EAF4 100%)',
    }}
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-8 lg:mb-14`}>
      Hear from happy launchers
    </h2>

    <div className="flex flex-col gap-4 p-6 border-2 border-white rounded-2xl shadow-sm max-w-2xl mx-auto bg-[#F8F9FC]">
      <TweetHeader />
      <TweetBody />
      <TweetFooter />
    </div>
  </SectionWrapper>
);
