import {
  SUB_HEADER_CLASS,
  // SECTION_BOX_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
// import Image from 'next/image';

const list = [
  {
    title: 'Boost transaction volume',
    desc: 'Transform autonomous AI agnets into your productive daily active users and boost your transaction volume and other valuable KPIs.',
  },
  {
    title: 'Access OLAS emissions',
    desc: 'Create staking contracts to attract OLAS emissions, providing rewards that incentivize operators to run your agents and grow your agent economy.',
  },
  {
    title: 'Enable users to run agents easily',
    desc: 'Enable your users to easily manage and run agents through the Olas Pearl App, which can be customized with your branding. Professional operators can also deploy agents for further scale.',
  },
  {
    title: 'Attract developers',
    desc: 'Tap into the thriving ecosystem of Olas agent developers to create and scale your agent economy with professional support.',
  },
  {
    title: 'Expand your reach',
    desc: 'Promote your agent economy within the Olas ecosystem by engaging operators and creating buzz. Leverage the Olas community to showcase your project, attract attention, and drive participation.',
  },
];

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

export const CreateAnAutonomousAiAgent = () => {
  const itemsToDisplay = list.slice(0, -1);
  const lastItem = list[list.length - 1];

  return (
    <SectionWrapper customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16 lg:pb-1">
      <div className="max-w-screen-xl mx-auto lg:px-12">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}>
          Why become an Olas Launcher?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {itemsToDisplay.map(({ title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6"
              style={eachCardCss}
            >
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className={TEXT_CLASS}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div
            className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6 md:w-1/3 lg:w-1/2"
            style={eachCardCss}
          >
            <h3 className="text-xl font-semibold">{lastItem.title}</h3>
            <p className={TEXT_CLASS}>{lastItem.desc}</p>
          </div>
        </div>
      </div>
      <SectionWrapper
        customClasses="lg:p-24 px-4 py-12 mt-20 bg-gray-50 "
        backgroundType="NONE"
      >
        <div className="text-center">
          <h2 className="text-center font-bold text-3xl">Hear from happy launchers</h2>
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
    </SectionWrapper>
  );
};
