import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Content } from 'components/TimelinePage/Content';
import { Header } from 'components/TimelinePage/Header';

const TimelinePage = () => (
  <PageWrapper>
    <Meta
      PageTitle="Timeline"
      description="Discover key milestones, product launches, and governance updates in the Olas timeline — a complete history from inception to today."
    />
    <Header />
    <Content />
  </PageWrapper>
);

export default TimelinePage;
