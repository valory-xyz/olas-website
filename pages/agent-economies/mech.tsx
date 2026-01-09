import { FeeMetrics } from 'components/AgentEconomies/MechPage/FeeMetrics';
import { GetInvolved } from 'components/AgentEconomies/MechPage/GetInvolved';
import { MechAgentMetrics } from 'components/AgentEconomies/MechPage/MechAgentMetrics';
import { MechHero } from 'components/AgentEconomies/MechPage/MechHero';
import { WhatIsOlasMech } from 'components/AgentEconomies/MechPage/WhatIsOlasMech';
import { WhyOlasMech } from 'components/AgentEconomies/MechPage/WhyOlasMech';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

import { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';

const Mech = ({ mech, mechFees }) => (
  <PageWrapper>
    <Meta
      pageTitle="Mech"
      description="Access powerful AI services for agent-based economies with Mech. Explore innovative solutions for creating, managing, and optimizing AI agents in the evolving world of crypto and AI technologies."
    />

    <MechHero />
    <MechAgentMetrics metrics={mech} />
    <FeeMetrics metrics={mechFees} />
    <WhatIsOlasMech />
    <WhyOlasMech />
    <GetInvolved />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'agent-economies' });
  const data = (snapshot?.data as AgentEconomiesMetricsData) || null;

  return {
    props: {
      mech: data?.mech || null,
      mechFees: data?.mechFees || null,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default Mech;
