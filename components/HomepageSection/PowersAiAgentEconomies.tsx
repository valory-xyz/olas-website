import SectionWrapper from 'components/Layout/SectionWrapper';
import { Activity } from './Activity';
import { TokenAddress } from './TokenAddress';

import PropTypes from 'prop-types';

export const PowersAiAgentEconomies = ({ metrics, isTxnMilestone = false }) => (
  <div className="relative">
    <div className="activity-bg h-full" />
    <SectionWrapper
      id="agent-economies"
      backgroundType="NONE"
      customClasses="bg-slate-100 text-center py-20"
    >
      <Activity metrics={metrics} isTxnMilestone={isTxnMilestone} />
      <TokenAddress />
    </SectionWrapper>
  </div>
);

PowersAiAgentEconomies.propTypes = {
  metrics: PropTypes.shape({}),
  isTxnMilestone: PropTypes.bool,
};
