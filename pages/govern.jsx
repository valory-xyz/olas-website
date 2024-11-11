import { Govern } from 'components/GovernPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const GovernPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas Govern"
      description="Join the decision-making process that drives growth in the Olas ecosystem; direct the future of Olas. Become an Olas Governor!"
    />
    <Govern />
  </PageWrapper>
);

export default GovernPage;
