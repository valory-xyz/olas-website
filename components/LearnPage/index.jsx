import { DecentralizedAndSophisticated } from './DecentralizedAndSophisticated';
import { HowDoAutonomousServicesWork } from './HowDoAutonomousServicesWork';
import { QuickIntroArticles } from './QuickIntroArticles';
import PageWrapper from '../Layout/PageWrapper';
import Meta from '../Meta';
import { AgentEconomics } from './AgentEconomics';
import { LearnHeader } from './LearnHeader';
import { SovereignAgents } from './SovereignAgents';
import { DecentralizedAgents } from './DecentralizedAgents';

export const LearnPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Learn"
      description="Build your understanding of what Olas is and how it works."
    />

    <LearnHeader />
    <SovereignAgents />
    <DecentralizedAgents />

    {/* TODO */}
    <DecentralizedAndSophisticated />
    <HowDoAutonomousServicesWork />
    <AgentEconomics />
    <QuickIntroArticles />
  </PageWrapper>
);
