import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { Hero } from 'components/ModelsPage/Hero';
import { ModelsSection } from 'components/ModelsPage/ModelsSection';

const ModelsPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Models"
      description="Specialised models trained for the agents running on Olas."
    />
    <Hero />
    <ModelsSection />
  </PageWrapper>
);

export default ModelsPage;
