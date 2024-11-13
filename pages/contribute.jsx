import Contribute from 'components/ContributePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const ContributePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Contribute"
      description="Advance the network, gain recognition and earn tokens. Start contributing today!"
    />
    <Contribute />
  </PageWrapper>
);

export default ContributePage;
