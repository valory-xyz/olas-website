import { SUB_HEADER_CLASS } from 'common-util/classes';
import { InfoCardList } from 'components/InfoCardList';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Gem, GitPullRequestArrow, Handshake, Navigation2 } from 'lucide-react';

const list = [
  {
    title: 'Unlock agent-to-agent collaboration',
    icon: <Handshake />,
    desc: 'Enable your agents to outsource, transact, and work together, unlocking new possibilities without intervention.',
  },
  {
    title: 'No more code upgrades',
    icon: <GitPullRequestArrow />,
    desc: 'If your Agent needs a skill it doesn’t have, it can simply hire Mech Agents to get the job done.',
  },
  {
    title: 'Turn services into rewards',
    icon: <Gem />,
    desc: 'Monetize your agent’s unique skills by offering its task-based services on the Mech Marketplace and earning rewards for fulfilling requests.',
  },
  {
    title: 'Truly autonomous agents',
    icon: <Navigation2 />,
    desc: 'Instead of operating in isolation, agents can now collaborate, outsource, and transact with one another—expanding their range of capabilities without external intervention.',
  },
];

export const WhyMechMarketplace = () => (
  <SectionWrapper customClasses="py-8 px-5 lg:py-24 lg:px-0 lg:pt-16 border-b">
    <div className="max-w-screen-xl mx-auto lg:px-12">
      <h2
        className={`${SUB_HEADER_CLASS} text-left mb-8 font-semibold lg:text-center lg:mb-14`}
      >
        Why try the Mech Marketplace?
      </h2>
      <InfoCardList cards={list} />
    </div>
  </SectionWrapper>
);
