import { AU } from 'components/AUPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const AUPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Agents Unleashed"
      description="The premier AI Agent event series, showcasing the cutting-edge of crypto and AI."
    />
    <AU />
  </PageWrapper>
);

export default AUPage;
