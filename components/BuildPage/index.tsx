import { BuildMetrics } from './BuildMetrics';
import { GetStarted } from './GetStarted';
import { Hero } from './Hero';
import { WaysToGrow } from './WaysToGrow';
import { WhatBuildersAreSaying } from './WhatBuildersAreSaying';

const Build = ({ metrics }) => (
  <>
    <Hero />
    <BuildMetrics metrics={metrics} />
    <WaysToGrow />
    <WhatBuildersAreSaying />
    {/* <ReadyToBuild /> */}
    {/* <NewToOlas /> */}
    <GetStarted />
  </>
);

export default Build;
