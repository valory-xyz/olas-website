import Explore from 'components/ExplorePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const ExplorePage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Explore"
      description="Discover the diverse applications and potential of autonomous agent economies in transforming industries and driving innovation."
    />
    <Explore />
  </PageWrapper>
);

export default ExplorePage;
