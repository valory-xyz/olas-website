import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Roadmap } from 'components/RoadmapPage';

const RoadmapPage = () => (
  <PageWrapper>
    <Meta pageTitle="Roadmap" />
    <Roadmap />
  </PageWrapper>
);

export default RoadmapPage;
