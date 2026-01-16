import { DeprecatedUseCases } from 'components/DeprecatedUseCasesPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const DeprecatedUseCasesPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Deprecated Use Cases"
      description="Browse deprecated Olas AI agents and past use cases. Explore the history of autonomous agents built on Olas."
    />
    <DeprecatedUseCases />
  </PageWrapper>
);

export default DeprecatedUseCasesPage;
