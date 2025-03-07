import { Launch } from 'components/LaunchPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const LaunchPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Launch"
      description="Create and deploy AI agent economies in your ecosystem. Manage agents and AI services with Olas Launch."
    />
    <Launch />
  </PageWrapper>
);

export default LaunchPage;
