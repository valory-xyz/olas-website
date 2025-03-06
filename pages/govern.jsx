import { Govern } from 'components/GovernPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const GovernPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Govern"
      description="Join Olas’ decision-making process. Shape the future of AI agents and the crypto ecosystem. Become an Olas Governor and drive growth."
    />
    <Govern />
  </PageWrapper>
);

export default GovernPage;
