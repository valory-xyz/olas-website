import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Roadmap } from 'components/RoadmapPage';

const RoadmapPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Roadmap"
      description="Explore the Olas roadmap for co-owned AI. Discover how Olas combines crypto ownership, AI models, and open source software to create autonomous agent economies."
    />
    <Roadmap />
  </PageWrapper>
);

export default RoadmapPage;
