import Accelerator from 'components/AcceleratorPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcceleratorPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas Accelerator"
      description="Build AI agents for Pearl, the AI Agent App Store. Accepted builders may earn rewards for their contributions."
    />
    <Accelerator />
  </PageWrapper>
);

export default AcceleratorPage;
