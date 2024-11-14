import { Bond } from 'components/BondsPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BondPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Bond"
      description="Join the Olas ecosystem as a Bonder and get discounted OLAS. Provide liquidity, grow the network, and get more OLAS. Start bonding today!"
    />
    <Bond />
  </PageWrapper>
);

export default BondPage;
