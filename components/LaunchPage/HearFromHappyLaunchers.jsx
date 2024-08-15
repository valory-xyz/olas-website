import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
// import Image from 'next/image';

export const HearFromHappyLaunchers = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 mt-20 bg-gray-50 "
    backgroundType="NONE"
  >
    <div className="text-center">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Hear from happy launchers
      </h2>

    </div>
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="relative mt-8 p-6 bg-white rounded-lg max-w-2xl mx-2">
        <img
          src="/images/launch-page/testimony-avatar.png"
          alt="avatar"
          className="absolute top-4 left-4 w-12 h-12 rounded-full border border-gray-200"
        />
        <img
          src="/images/launch-page/gnosis-logo.svg"
          alt="gnosis"
          className="absolute top-4 right-4 w-12 h-12 rounded-full border border-gray-200"
        />
        <div className="ml-16">
          <h1 className="text-start font-bold mx">
            Martin Koppelmann, Co-Founder and CEO of Gnosis
            <br />
            {' '}
            <span className="text-gray-600 font-thin">@koeppelmann</span>
          </h1>
        </div>
      </div>
      <p className="mx-2">Another big user has been AI agents by @autonolas - we have this ongoing challenge where agents gather information and trade information and trade on prediction markets - this has lead to the majority of @safe transaction on Gnosis been executed by agents!</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-400 text-xs">
          10:16AM Nov 15, 2023
          {' '}
          <span className="text-black font-semibold">7,268</span>
          {' '}
          Views
        </p>
        <p className="font-bold text-sm cursor-pointer">
          View post on X
        </p>
      </div>
    </div>
  </SectionWrapper>
);
