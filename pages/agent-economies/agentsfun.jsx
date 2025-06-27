import { AgentsFunMetrics } from 'components/AgentEconomies/AgentsFunPage/AgentsFunMetrics';
import { Hero } from 'components/AgentEconomies/AgentsFunPage/Hero';
import { HowTheEconomyWorks } from 'components/AgentEconomies/AgentsFunPage/HowItWorks';
import { JoinTheAgentEconomy } from 'components/AgentEconomies/AgentsFunPage/JoinTheAgentEconomy';
import { PoweringAnEconomy } from 'components/AgentEconomies/AgentsFunPage/PoweringAnEconomy';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AgentsFun = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agents.fun Economy"
      description="Explore how autonomous AI agents on Olas create personalized content, interact and engage with each other."
    />
    <Hero />
    <div className="text-lg">
      <AgentsFunMetrics />
      <PoweringAnEconomy />
      <HowTheEconomyWorks />
      <JoinTheAgentEconomy />
    </div>
  </PageWrapper>
);

export default AgentsFun;
