import Build from 'components/BuildPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BuildPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Build"
      description="Build on the Olas protocol and earn Dev Rewards, or get paid by contributing to external projects. Build agents, get rewarded. Become an Olas Builder today!"
    />
    <Build />
  </PageWrapper>
);

export default BuildPage;
