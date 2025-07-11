import { BUILD_MECH_TOOL_URL, LAUNCH_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'For Builders',
    desc: 'Build Mech tools and improve Trader strategies.',
    urlName: 'View path',
    url: BUILD_MECH_TOOL_URL,
    isSubsite: true,
  },
  {
    title: 'For Operators',
    desc: 'Run Trader agents using Pearl or manually.',
    urlName: 'Explore paths',
    url: '/operate',
  },
  {
    title: 'For Launchers',
    desc: 'Launch your own agent economy.',
    urlName: 'Explore',
    url: LAUNCH_URL,
    isSubsite: true,
  },
];

const Content = () => <GetInvolvedCards id="get-started" list={list} />;

export const PredictFooter = () => (
  <SectionWrapper
    customClasses="py-12 border border-purple-200 border-x-0"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 mx-auto items-center">
      <h3 className="text-center w-full italic text-purple-900 font-medium">
        Join the revolution in prediction markets with Olas Predict
      </h3>
    </div>
  </SectionWrapper>
);

export const GetInvolved = () => (
  <>
    <Content />
    <PredictFooter />
  </>
);
