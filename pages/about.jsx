import { About } from 'components/AboutPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AcceleratorPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas: Co-own AI"
      description="Olas enables everyone to own & monetize their AI Agents"
    />
    <About />
  </PageWrapper>
);

export default AcceleratorPage;
