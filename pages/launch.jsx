import { Launch } from 'components/LaunchPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const LaunchPage = () => (
  <PageWrapper>
    <Meta
      pageTitle='Launch'
      description='Create and deploy entire AI agent economies within your ecosystem effortlessly. Become an Olas Launcher!'
    />
    <Launch />
  </PageWrapper>
);

export default LaunchPage;
