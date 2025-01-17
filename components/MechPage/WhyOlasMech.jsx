import { SUB_HEADER_LG_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { BicepsFlexed, HandCoins, Sparkles } from 'lucide-react';

const list = [
  {
    title: 'Specialization',
    icon: <Sparkles color="#606F85" />,
    desc: 'Thanks to Mechs, agents in use cases like Predict or Optimus do not need to run open-source models or maintain API keys to closed source models.',
  },
  {
    title: 'Scale',
    icon: <BicepsFlexed color="#606F85" />,
    desc: 'Thanks to Mech marketplace, Mechs can scale horizontally, with new Mechs being added by the Olas community to serve a diverse set of use cases.',
  },
  {
    title: 'Fee capture',
    icon: <HandCoins color="#606F85" />,
    desc: 'Mech marketplace offers a fee capture mechanism for the Olas protocol.',
  },
];

export const WhyOlasMech = () => (
  <SectionWrapper customClasses="lg:pt-16 max-lg:px-6 py-8">
    <div
      className="max-w-screen-xl lg:px-44 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12"
      id="why-olas-mech"
    >
      <h2
        className={`${SUB_HEADER_LG_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why Olas Mech agent economy?
      </h2>
      <InfoCardList wrapperClasses="" cards={list} />
    </div>
  </SectionWrapper>
);
