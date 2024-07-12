import {
  BicepsFlexed, Expand, HandCoins, Sparkles,
} from 'lucide-react';
import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';

const list = [
  {
    title: 'Innovation',
    desc: 'Harnesses the power of autonomous agents to streamline prediction markets.',
    icon: <Sparkles />,
  },
  {
    title: 'Efficiency',
    desc: 'Deliver predictions at an unprecedented level of efficiency.',
    icon: <BicepsFlexed />,
  },
  {
    title: 'Profit Potential',
    desc: 'Operators can run agents to potentially earn staking rewards and engage in autonomous betting.',
    icon: <HandCoins />,
  },
  {
    title: 'Scalability',
    desc: 'Demonstrated effectiveness with significant transaction activity on the Gnosis Chain.',
    icon: <Expand />,
  },
];

const eachCardCss = {
  background:
    'linear-gradient(94.05deg, #F2F4F9 0%, rgba(242, 244, 249, 0) 100%)',
};

const Content = () => (
  <div className="max-w-screen-lg lg:px-12 mx-auto lg:grid-cols-12">
    <h2
      className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
    >
      Why Olas Predict?
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {list.map(({ title, desc, icon }) => (
        <div
          key={title}
          className="flex flex-col gap-3 bg-gradient-to-r p-4 rounded-xl border lg:p-6"
          style={eachCardCss}
        >
          <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-semibold ml-2">{title}</h2>
          </div>

          <p className={TEXT_CLASS}>{desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export const WhyOlasPredict = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS}`}>
    <Content />
  </SectionWrapper>
);
