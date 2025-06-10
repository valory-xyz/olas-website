import { BuildMetrics } from './BuildMetrics';
import { Hero } from './Hero';
import { NewToOlas } from './NewToOlas';
import { ReadyToBuild } from './ReadyToBuild';
import { WaysToGrow } from './WaysToGrow';
import { WhatBuildersAreSaying } from './WhatBuildersAreSaying';

const Build = () => (
  <>
    <Hero />
    <BuildMetrics />
    <WaysToGrow />
    <WhatBuildersAreSaying />
    <ReadyToBuild />
    <NewToOlas />
  </>
);

export default Build;
