import Bottle from 'components/BottlePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BottlePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Run Your First AI Agent And Discover What Olas Can Do | Olas"
      description="Discover Olas: the AI Agent App Store. Start your AI journey with your free eco-friendly bottle. Plus, join the future of Crypto x AI with open roles and stay updated with Agents Unleashed podcast news."
    />
    <Bottle />
  </PageWrapper>
);

export default BottlePage;
