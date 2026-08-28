import SectionWrapper from 'components/Layout/SectionWrapper';
import { Activity } from './Activity';
import { TokenAddress } from './TokenAddress';

import PropTypes from 'prop-types';

export const PowersAiAgentEconomies = ({ metrics, protocolMetrics = null }) => (
  // overflow-x-clip: the flywheel's fixed-width canvas overflows narrow
  // viewports before it scales down; `clip` (not `hidden`) contains it without
  // creating a scroll container or affecting vertical overflow.
  <div className="relative overflow-x-clip">
    <div className="activity-bg h-full" />
    <SectionWrapper
      id="agent-economies"
      backgroundType="NONE"
      customClasses="bg-slate-100 text-center py-20"
    >
      <Activity metrics={metrics} protocolMetrics={protocolMetrics} />
      <TokenAddress />
    </SectionWrapper>
  </div>
);

PowersAiAgentEconomies.propTypes = {
  metrics: PropTypes.shape({}),
  protocolMetrics: PropTypes.shape({}),
};
