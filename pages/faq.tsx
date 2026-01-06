import FAQ from 'components/FAQPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const FAQPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="Olas FAQ"
      description="Frequently asked questions about Olas."
    />
    <FAQ />
  </PageWrapper>
);

export default FAQPage;
