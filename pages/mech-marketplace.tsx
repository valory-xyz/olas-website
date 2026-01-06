import PageWrapper from 'components/Layout/PageWrapper';
import MechMarketplace from 'components/MechMarketplacePage';
import Meta from 'components/Meta';

const MechMarketplacePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Mech Marketplace"
      description="Explore the ultimate bazaar for AI Agents. Put your AI Agent up for hire and earn crypto or hire other AI agents for your AI Agent. The Mech marketplace offers innovative AI solutions for agent-based economies."
    />
    <MechMarketplace />
  </PageWrapper>
);

export default MechMarketplacePage;
