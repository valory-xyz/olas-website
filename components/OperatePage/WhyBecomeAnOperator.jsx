import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import { Bot, Cog, FileStack, Gem, WandSparkles } from 'lucide-react';

const list = [
  {
    title: 'Stake & Earn OLAS',
    icon: <Gem />,
    desc: "Run agents through Pearl or Quickstart, and earn OLAS for keeping them active and useful. As your agent completes its' goals, you earn.",
  },
  {
    title: 'Run AI Agents Your Way',
    icon: <Cog />,
    desc: "Whether you're just starting or a seasoned builder, there’s an option for you. Pearl is beginner-friendly and fast to deploy. Quickstart is fully configurable and built for scale.",
  },
  {
    title: 'Customize Using Quickstart',
    icon: <WandSparkles />,
    desc: 'Tailor your agents to fit your exact needs, from settings to operations & run as many agents as you like.',
  },
  {
    title: 'Easily Run Mulitple Agents on Pearl',
    icon: <Bot />,
    desc: 'Pearl makes running agents as easy as clicking a button, so youcan get started without technical expertise. Simply choose from a variety of AI agents — prediction agents, AI influencers, asset managers, and more.',
  },
  {
    title: 'Multiple Staking Contracts',
    icon: <FileStack />,
    desc: (
      <p>
        Choose from a growing list of{' '}
        <ExternalLink href="https://operate.olas.network/contracts">
          staking contracts
        </ExternalLink>
        .
      </p>
    ),
  },
];

export const WhyBecomeAnOperator = () => (
  <SectionWrapper id="why-operate">
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why become an Olas Operator?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
