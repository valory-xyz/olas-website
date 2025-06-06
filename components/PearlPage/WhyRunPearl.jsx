import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Bot, Gem, LockKeyhole, WandSparkles } from 'lucide-react';

const list = [
  {
    title: 'Mulitple agents in one app',
    icon: <Bot />,
    desc: 'Choose from a variety of AI agents — prediction agents, AI influencers, asset managers, and more. Whatever your goal, there’s an agent for you.',
  },
  {
    title: 'Earn OLAS',
    icon: <Gem />,
    desc: 'Stake OLAS and let your agents work autonomously, earning you potential OLAS rewards.',
  },
  {
    title: 'Simple set up',
    icon: <WandSparkles />,
    desc: 'No technical expertise? No problem. Pearl makes running agents as easy as clicking a button, so anyone can participate.',
  },
  {
    title: 'Transparent and Secure',
    icon: <LockKeyhole />,
    desc: "Pearl's open-source design ensures transparency, while smart wallet backups keep your funds secure.",
  },
];

export const WhyRunPearl = () => (
  <SectionWrapper
    id="benefits"
    customClasses="py-8 px-5 lg:py-12 lg:px-0 lg:pt-16"
  >
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 font-semibold lg:text-center lg:mb-14`}
      >
        Why run Pearl?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
