import SectionWrapper from 'components/Layout/SectionWrapper';
import { Activity } from './Activity';
import { TokenAddress } from './TokenAddress';

import PropTypes from 'prop-types';

export const PowersAiAgentEconomies = ({ metrics }) => (
  <div className="relative">
    <div className="activity-bg h-full" />
    <SectionWrapper
      id="agent-economies"
      backgroundType="NONE"
      customClasses="bg-slate-100 text-center py-20"
    >
      <Activity metrics={metrics} />
      <TokenAddress />
    </SectionWrapper>
  </div>
);

PowersAiAgentEconomies.propTypes = {
  metrics: PropTypes.shape({}),
};
