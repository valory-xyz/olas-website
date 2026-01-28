import { BUILD_MECH_TOOL_URL } from 'common-util/constants';
import { GetInvolvedCards } from 'components/GetInvolvedCards';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'For builders',
    desc: 'Build a Prediction Broker agent and turn it into a service provider for other agents.',
    urlName: 'View path',
    url: BUILD_MECH_TOOL_URL,
    isSubsite: true,
  },
  {
    title: 'For operators',
    desc: 'Run Prediction agents using Pearl or manually via Quickstart.',
    urlName: 'Explore paths',
    url: '/operate',
  },
];

const Content = () => (
  <div className="mx-auto max-w-[872px]">
    <GetInvolvedCards id="get-started" list={list} />
  </div>
);

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
