import PageWrapper from 'components/Layout/PageWrapper';
import { GetInvolved } from 'components/MechPage/GetInvolved';
import { MechAgentMetrics } from 'components/MechPage/MechAgentMetrics';
import { MechHero } from 'components/MechPage/MechHero';
import { WhatIsOlasMech } from 'components/MechPage/WhatIsOlasMech';
import { WhyOlasMech } from 'components/MechPage/WhyOlasMech';
import Meta from 'components/Meta';

const Mech = () => (
  <PageWrapper>
    <Meta pageTitle="Mech" description="AI services for agent economies" />

    <MechHero />
    <MechAgentMetrics />
    <WhatIsOlasMech />
    <WhyOlasMech />
    <GetInvolved />
  </PageWrapper>
);

export default Mech;
