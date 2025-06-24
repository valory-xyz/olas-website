import SectionWrapper from 'components/Layout/SectionWrapper';
import { Activity } from './Activity';
import { TokenAddress } from './TokenAddress';

export const PowersAiAgentEconomies = () => (
  <div className="relative">
    <div className="activity-bg h-full" />
    <SectionWrapper
      id="agent-economies"
      backgroundType="NONE"
      customClasses="bg-slate-100 text-center py-20"
    >
      <Activity />
      <TokenAddress />
    </SectionWrapper>
  </div>
);
