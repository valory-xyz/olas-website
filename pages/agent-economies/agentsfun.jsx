import { AgentsFunMetrics } from 'components/AgentsFunPage/AgentsFunMetrics';
import { CTA } from 'components/AgentsFunPage/CTA';
import { Hero } from 'components/AgentsFunPage/Hero';
import { HowItWorks } from 'components/AgentsFunPage/HowItWorks';
import { JoinTheAgentEconomy } from 'components/AgentsFunPage/JoinTheAgentEconomy';
import { PoweringAnEconomy } from 'components/AgentsFunPage/PoweringAnEconomy';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AgentsFun = () => (
  <PageWrapper>
    <Meta pageTitle="Agents.fun Economy" description="" />
    <Hero />
    <div className="text-lg">
      <AgentsFunMetrics />
      <PoweringAnEconomy />
      <HowItWorks />
      <JoinTheAgentEconomy />
      <CTA />
    </div>
  </PageWrapper>
);

export default AgentsFun;
