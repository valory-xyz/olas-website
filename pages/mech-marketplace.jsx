import PageWrapper from 'components/Layout/PageWrapper';
import MechMarketplace from 'components/MechMarketplacePage';
import Meta from 'components/Meta';

const MechMarketplacePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Mech Marketplace"
      description="Explore the ultimate marketplace for AI agents. Find, buy, and sell AI services, tools, and solutions that power crypto and AI ecosystems. The Mech marketplace offers innovative AI solutions for agent-based economies."
    />
    <MechMarketplace />
  </PageWrapper>
);

export default MechMarketplacePage;
