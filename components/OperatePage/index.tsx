import { EarnOlas } from './EarnOlas';
import { GetStarted } from './GetStarted';
import { Hero } from './Hero';
import { OperateMetrics } from './OperateMetrics';
import { WhatOperatorsAreSaying } from './WhatOperatorsAreSaying';
import { WhyBecomeAnOperator } from './WhyBecomeAnOperator';

const Operate = ({ metrics, snapshotTimestamp = null }) => (
  <>
    <Hero />
    <OperateMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
    <EarnOlas />
    <WhyBecomeAnOperator />
    <WhatOperatorsAreSaying />
    <GetStarted />
  </>
);

export default Operate;
