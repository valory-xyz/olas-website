import Accelerator from 'components/AcceleratorPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcceleratorPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas Accelerator"
      description="Build AI agents for Pearl: The Agent App Store & get paid."
    />
    <Accelerator />
  </PageWrapper>
);

export default AcceleratorPage;
