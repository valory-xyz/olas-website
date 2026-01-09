import { EarnOlas } from './EarnOlas';
import { GetStarted } from './GetStarted';
import { Hero } from './Hero';
import { OperateMetrics } from './OperateMetrics';
import { WhatOperatorsAreSaying } from './WhatOperatorsAreSaying';
import { WhyBecomeAnOperator } from './WhyBecomeAnOperator';

const Operate = ({ metrics }) => (
  <>
    <Hero />
    <OperateMetrics metrics={metrics} />
    <EarnOlas />
    <WhyBecomeAnOperator />
    <WhatOperatorsAreSaying />
    <GetStarted />
  </>
);

export default Operate;
