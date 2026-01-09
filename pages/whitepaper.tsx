import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import { WhitepaperPage } from 'components/WhitepaperPage';

const Whitepaper = () => (
  <PageWrapper>
    <Meta
      pageTitle="Whitepaper"
      description="Visit our whitepapers page to explore in-depth analysis, research, and insights on Olas. Gain expert perspectives to help you make informed decisions."
    />
    <WhitepaperPage />
  </PageWrapper>
);

export default Whitepaper;
