import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import OlasToken from 'components/OlasTokenPage';

const OlasTokenPage = () => (
  <PageWrapper>
    <Meta
      pageTitle="OLAS Token"
      description="View live data on token supply, emissions schedules, and other key metrics on Olas. Visual charts and statistics to help you track and analyze important trends."
    />
    <OlasToken />
  </PageWrapper>
);

export default OlasTokenPage;
