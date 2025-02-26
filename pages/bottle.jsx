import Bottle from 'components/BottlePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BottlePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas Bottle"
      description="Find out about the latest Olas events at ETH Denver!"
    />
    <Bottle />
  </PageWrapper>
);

export default BottlePage;
