import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  CircleArrowUp,
  Gem,
  GitPullRequestArrow,
  Handshake,
  Navigation2,
} from 'lucide-react';

const list = [
  {
    title: 'No more code upgrades',
    icon: <GitPullRequestArrow />,
    desc: 'If your Agent needs a skill it doesn’t have, it can simply hire Mech Agents to get the job done.',
  },
  {
    title: 'Unlock agent-to-agent collaboration',
    icon: <Handshake />,
    desc: 'Enable your agents to outsource, transact, and work together, unlocking new possibilities without intervention.',
  },
  {
    title: 'Expand agent capabilities',
    icon: <CircleArrowUp />,
    desc: 'Instantly unlock new tools, AI workflows, and automation for your AI Agent without wasting time on manual upgrades.',
  },
  {
    title: 'Monetize your AI Agent',
    icon: <Gem />,
    desc: 'Offer your AI Agent’s services on the Mech Marketplace and start earning crypto rewards.',
  },
  {
    title: 'Truly autonomous agents',
    icon: <Navigation2 />,
    desc: 'Instead of operating in isolation, agents can now collaborate, outsource, and transact with one another and do more — without human intervention.',
  },
];

export const WhyUseMechMarketplace = () => (
  <SectionWrapper customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16 lg:pb-24 border-b-1.5">
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
      >
        Why use the Mech Marketplace?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
