import { Bottle } from 'components/BottlePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BottlePage = () => (
  <PageWrapper>
    <Meta pageTitle="Bottle" description="Bottle" />
    <Bottle />
  </PageWrapper>
);

export default BottlePage;
