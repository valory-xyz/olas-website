import { Descriptions } from 'components/AgentEconomies/BabydegenEconomyPage/Descriptions';
import { Hero } from 'components/AgentEconomies/BabydegenEconomyPage/Hero';
import { HowBabydegenEconomyWorks } from 'components/AgentEconomies/BabydegenEconomyPage/HowBabydegenEconomyWorks';
import { Join } from 'components/AgentEconomies/BabydegenEconomyPage/Join';
import { OptimusAgentMetrics } from 'components/AgentEconomies/BabydegenEconomyPage/OptimusAgentMetrics';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Optimus = () => (
  <PageWrapper>
    <Meta
      pageTitle="Babydegen Economy"
      description="Discover autonomous AI agents trading across DeFi with Olas—managing assets and evolving 24/7. Join the future of decentralized finance today."
    />
    <Hero />
    <OptimusAgentMetrics />
    <Descriptions />
    <HowBabydegenEconomyWorks />
    <Join />
    {/* <GetInvolved /> */}
  </PageWrapper>
);

export default Optimus;
