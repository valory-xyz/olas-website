import { getSnapshot } from 'common-util/snapshot-storage';
import { Bond } from 'components/BondsPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BondPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Bond"
      description="Join the Olas ecosystem as a Bonder to get discounted OLAS tokens. Provide liquidity, grow the crypto network, and earn rewards in the world of AI and blockchain. Start bonding and benefiting today!"
    />
    <Bond metrics={metrics} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'other' });
  return {
    props: {
      metrics: snapshot?.data || null,
    },
    revalidate: 60,
  };
};

export default BondPage;
