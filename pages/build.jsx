import Build from 'components/BuildPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BuildPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Build"
      description="Build on Olas protocol, earn Dev Rewards, create AI agents, or contribute to crypto projects. Become an Olas Builder and get paid."
    />
    <Build />
  </PageWrapper>
);

export default BuildPage;
