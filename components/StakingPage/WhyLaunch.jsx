import { SUB_HEADER_CLASS, SUB_HEADER_MEDIUM_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'Ignite Agent Economies',
    description:
      "Use Olas' Proof-of-Active-Agent (PoAA) to kickstart ecosystems where rewards are tied to real on-chain agent performance—like DeFi or governance—not passive token holding.",
  },
  {
    title: 'Tailor Incentives to Your Goals',
    description:
      'Define your own KPIs. Deploy staking contracts that reward only when those outcomes are met, ensuring emissions are tied to meaningful results.',
  },
  {
    title: 'Drive Impact Beyond TVL',
    description:
      'PoAA grows networks through active agent work, not just locked capital. This drives real usage, deeper engagement, and scalable ecosystem growth.',
  },
];

export const WhyLaunch = () => (
  <SectionWrapper id="why-launch">
    <div className="flex flex-col gap-14 max-w-2xl mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} text-center`}>
        Why Launch a Staking Program?
      </h2>
      {list.map((item) => (
        <div key={item.title}>
          <h4 className={`${SUB_HEADER_MEDIUM_CLASS} mb-2`}>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
