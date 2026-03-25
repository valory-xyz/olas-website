import { AgentEconomies } from 'components/AgentEconomies';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AgentEconomiesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agent Economies"
      description="Discover the first active AI agent economies on Olas—specialized agents like Predict, BabyDegen, Mech, and Agents.fun operating autonomously toward specific goals. Explore how agents collaborate, create, and power the decentralized AI ecosystem."
      ogPath="agent-economies"
    />
    <AgentEconomies />
  </PageWrapper>
);

export default AgentEconomiesPage;
