import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const EarnOlas = () => (
  <SectionWrapper>
    <div className="max-w-[648px] mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>
        Earn OLAS for Running AI Agents
      </h2>
      <p className="text-lg">
        Operators are the backbone of the Olas ecosystem. By running agents via
        Pearl or Quickstart, staking OLAS, and keeping agents active, you help
        power the network—and get rewarded for it. You can get started simply
        with a laptop. Just run agents, stake, and earn.
      </p>
    </div>
  </SectionWrapper>
);
