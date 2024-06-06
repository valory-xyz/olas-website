import Meta from 'components/Meta';
import PageWrapper from 'components/Layout/PageWrapper';
import { DecentralizedAndSophisticated } from 'components/LearnPage/DecentralizedAndSophisticated';
import { HowDoDecentralizedAgentsWork } from 'components/LearnPage/HowDoDecentralizedAgentsWork';
import { QuickIntroArticles } from 'components/LearnPage/QuickIntroArticles';
import { AgentEconomics } from 'components/LearnPage/AgentEconomics';
import { LearnHeader } from 'components/LearnPage/LearnHeader';
import { SovereignAgents } from 'components/LearnPage/SovereignAgents';
import { DecentralizedAgents } from 'components/LearnPage/DecentralizedAgents';
import { DoesOlSupportMultiAgentSystems } from 'components/LearnPage/DoesOlasSupportMultiAgentSystems';

const LearnPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Learn"
      description="Build your understanding of what Olas is and how it works."
    />

    <LearnHeader />
    <SovereignAgents />
    <DecentralizedAgents />
    <HowDoDecentralizedAgentsWork />
    <DecentralizedAndSophisticated />
    <AgentEconomics />
    <DoesOlSupportMultiAgentSystems />
    <QuickIntroArticles />
  </PageWrapper>
);

export default LearnPage;
