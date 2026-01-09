import { AgentsFunMetrics } from 'components/AgentEconomies/AgentsFunPage/AgentsFunMetrics';
import { GetInvolved } from 'components/AgentEconomies/AgentsFunPage/GetInvolved';
import { Hero } from 'components/AgentEconomies/AgentsFunPage/Hero';
import { HowTheEconomyWorks } from 'components/AgentEconomies/AgentsFunPage/HowItWorks';
import { PoweringAnEconomy } from 'components/AgentEconomies/AgentsFunPage/PoweringAnEconomy';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

import { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';

const AgentsFun = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Agents.fun Economy"
      description="Explore how autonomous AI agents on Olas create personalized content, interact and engage with each other."
    />
    <Hero />
    <div className="text-lg">
      <AgentsFunMetrics metrics={metrics} />
      <PoweringAnEconomy />
      <HowTheEconomyWorks />
      <GetInvolved />
      {/* <JoinTheAgentEconomy /> */}
    </div>
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'agent-economies' });
  const metrics =
    (snapshot?.data as AgentEconomiesMetricsData)?.agentsFun || null;

  return {
    props: {
      metrics,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default AgentsFun;
