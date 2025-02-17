import { ContributeMetrics } from './ContributeMetrics';
import { GetOlas } from './GetOlas';
import { GetStarted } from './GetStarted';
import Hero from './Hero';
import { WhatContributorsAreSaying } from './WhatContributorsAreSaying';
import { WhyBecomeAnOlasContributor } from './WhyBecomeAnOlasContributor';

const ContributePage = () => (
  <>
    <Hero />
    <ContributeMetrics />
    <GetOlas />
    <WhyBecomeAnOlasContributor />
    <WhatContributorsAreSaying />
    <GetStarted />
  </>
);

export default ContributePage;
