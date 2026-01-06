import Contribute from 'components/ContributePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const ContributePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Contribute"
      description="Enhance your network’s impact with Olas Contribute. Track and amplify contributions in crypto and AI with autonomous AI services."
    />
    <Contribute />
  </PageWrapper>
);

export default ContributePage;
