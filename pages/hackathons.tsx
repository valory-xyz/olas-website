import { Hackathon } from 'components/HackathonPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const HackathonPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Hackathons"
      description="Hackathons to push forward the use of decentralized autonomous agents and AI in prediction markets."
    />
    <Hackathon />
  </PageWrapper>
);

export default HackathonPage;
