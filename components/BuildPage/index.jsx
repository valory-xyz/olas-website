import { BuildMetrics } from './BuildMetrics';
import { GetStarted } from './GetStarted';
import { Hero } from './Hero';
import { WaysToGrow } from './WaysToGrow';
import { WhatBuildersAreSaying } from './WhatBuildersAreSaying';

const Build = () => (
  <>
    <Hero />
    <BuildMetrics />
    <WaysToGrow />
    <WhatBuildersAreSaying />
    {/* <ReadyToBuild /> */}
    {/* <NewToOlas /> */}
    <GetStarted />
  </>
);

export default Build;
