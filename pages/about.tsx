import { About } from 'components/AboutPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcceleratorPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="About"
      description="Olas enables everyone to own & monetize their AI Agents"
      ogPath="about"
    />
    <About />
  </PageWrapper>
);

export default AcceleratorPage;
