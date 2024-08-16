import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'Boost transaction volume',
    desc: 'Transform autonomous AI agents into your productive daily active users and boost your transaction volume and other valuable KPIs.',
  },
  {
    title: 'Access OLAS emissions',
    desc: 'Create staking contracts to attract OLAS emissions, providing rewards that incentivize operators to run your agents and grow your agent economy.',
  },
  {
    title: 'Enable users to run agents easily',
    desc: 'Enable your users to easily manage and run agents through the Olas Pearl app, which can be customized with your branding. Professional operators can also deploy agents for further scale.',
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

export const WhyBecomeAnOlasLauncher = () => (
  <SectionWrapper customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16 lg:pb-1">
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why become an Olas Launcher?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
