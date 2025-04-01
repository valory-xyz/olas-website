import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'Earn Rewards',
    desc: 'Compete for prize pools and potential ongoing Olas Dev Rewards for useful agent contribution.',
  },
  {
    title: 'Connect with a Pioneering Community',
    desc: 'Meet like-minded builders and AI agent developers building composable AI systems.',
  },
  {
    title: 'Learn and Level Up',
    desc: 'Grow your skills with hands-on practice, technical support, and guidance throughout the event.',
  },
  {
    title: 'Push the Boundaries',
    desc: 'Propose novel use cases — as long as they deliver helpful outcomes or serve a meaningful purpose.',
  },
];

export const WhyParticipate = () => (
  <SectionWrapper
    id="why-participate"
    customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16"
  >
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2 className={`${SUB_HEADER_CLASS} text-left mb-8 text-center lg:mb-14`}>
        Why Hack with Olas?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
