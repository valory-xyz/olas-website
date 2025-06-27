import { DeprecatedUseCases } from 'components/DeprecatedUseCasesPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const DeprecatedUseCasesPage = () => (
  <PageWrapper>
    <Meta pageTitle="Deprecated Use Cases" description="" />
    <DeprecatedUseCases />
  </PageWrapper>
);

export default DeprecatedUseCasesPage;
