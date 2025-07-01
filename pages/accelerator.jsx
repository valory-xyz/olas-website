import Accelerator from 'components/AcceleratorPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcceleratorPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas Accelerator"
      description="Build AI agents for Pearl, the AI Agent App Store, and earn rewards. Create AI agents and get paid in the growing AI and crypto space."
    />
    <Accelerator />
  </PageWrapper>
);

export default AcceleratorPage;
