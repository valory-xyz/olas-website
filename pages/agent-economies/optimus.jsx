import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { OptimusAgentMetrics } from 'components/OptimusPage/OptimusAgentMetrics';
import { OptimusHero } from 'components/OptimusPage/OptimusHero';
import { WhatIsOlasOptimus } from 'components/OptimusPage/WhatIsOlasOptimus';
import { WhyOlasOptimus } from 'components/OptimusPage/WhyOlasOptimus';

const Optimus = () => (
  <PageWrapper>
    <Meta pageTitle="Optimus" description="AI Agent-powered DeFi Management" />

    <OptimusHero />
    <OptimusAgentMetrics />
    <WhatIsOlasOptimus />
    <WhyOlasOptimus />
  </PageWrapper>
);

export default Optimus;
