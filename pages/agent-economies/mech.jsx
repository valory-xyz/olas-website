import PageWrapper from 'components/Layout/PageWrapper';
import { FeeMetrics } from 'components/AgentEconomies/MechPage/FeeMetrics';
import { GetInvolved } from 'components/AgentEconomies/MechPage/GetInvolved';
import { MechAgentMetrics } from 'components/AgentEconomies/MechPage/MechAgentMetrics';
import { MechHero } from 'components/AgentEconomies/MechPage/MechHero';
import { WhatIsOlasMech } from 'components/AgentEconomies/MechPage/WhatIsOlasMech';
import { WhyOlasMech } from 'components/AgentEconomies/MechPage/WhyOlasMech';
import Meta from 'components/Meta';

const Mech = () => (
  <PageWrapper>
    <Meta
      pageTitle="Mech"
      description="Access powerful AI services for agent-based economies with Mech. Explore innovative solutions for creating, managing, and optimizing AI agents in the evolving world of crypto and AI technologies."
    />

    <MechHero />
    <MechAgentMetrics />
    <FeeMetrics />
    <WhatIsOlasMech />
    <WhyOlasMech />
    <GetInvolved />
  </PageWrapper>
);

export default Mech;
