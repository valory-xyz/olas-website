import { AgentsFunMetrics } from 'components/AgentsFunPage/AgentsFunMetrics';
import { Hero } from 'components/AgentsFunPage/Hero';
import { HowTheEconomyWorks } from 'components/AgentsFunPage/HowItWorks';
import { JoinTheAgentEconomy } from 'components/AgentsFunPage/JoinTheAgentEconomy';
import { PoweringAnEconomy } from 'components/AgentsFunPage/PoweringAnEconomy';
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
      {/* <CTA /> */}
    </div>
  </PageWrapper>
);

export default AgentsFun;
