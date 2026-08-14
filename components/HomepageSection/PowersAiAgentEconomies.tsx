import SectionWrapper from 'components/Layout/SectionWrapper';
import { Activity } from './Activity';
import { TokenAddress } from './TokenAddress';

import PropTypes from 'prop-types';

export const PowersAiAgentEconomies = ({ metrics, isTxnMilestone = false }) => (
  // overflow-x-clip: the milestone confetti canvas reaches well past the card
  // so particles aren't cut off, which on a phone put it past the viewport and
  // gave the whole page a horizontal scroll. `clip` (not `hidden`) contains it
  // without creating a scroll container or affecting vertical overflow.
  <div className="relative overflow-x-clip">
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
