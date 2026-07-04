import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import { Bond } from 'components/BondsPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BondPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Bond"
      description="Join the Olas ecosystem as a Bonder. Provide liquidity to support the network and receive OLAS in return, subject to program availability and vesting periods."
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
    revalidate: REVALIDATE_DURATION,
  };
};

export default BondPage;
