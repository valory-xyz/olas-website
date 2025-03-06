import Explore from 'components/ExplorePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const ExplorePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Explore"
      description="Dive into the world of autonomous agent economies! Discover how AI agents are transforming industries, driving innovation, and reshaping the future of decentralized systems in the crypto and AI space."
    />
    <Explore />
  </PageWrapper>
);

export default ExplorePage;
