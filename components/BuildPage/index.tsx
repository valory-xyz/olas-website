import { BuildMetrics } from './BuildMetrics';
import { GetStarted } from './GetStarted';
import { Hero } from './Hero';
import { WaysToGrow } from './WaysToGrow';
import { WhatBuildersAreSaying } from './WhatBuildersAreSaying';

const Build = ({ metrics, snapshotTimestamp }) => (
  <>
    <Hero />
    <BuildMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
    <WaysToGrow />
    <WhatBuildersAreSaying />
    {/* <ReadyToBuild /> */}
    {/* <NewToOlas /> */}
    <GetStarted />
  </>
);

export default Build;
