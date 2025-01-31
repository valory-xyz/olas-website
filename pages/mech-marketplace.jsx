import PageWrapper from 'components/Layout/PageWrapper';
import MechMarketplace from 'components/MechMarketplacePage';
import Meta from 'components/Meta';

const MechMarketplacePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Mech Marketplace"
      description="The ultimate bazaar for AI Agents! Check out what's available at the mech marketplace."
    />
    <MechMarketplace />
  </PageWrapper>
);

export default MechMarketplacePage;
