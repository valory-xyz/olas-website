import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
import OlasToken from 'components/OlasTokenPage';

const OlasTokenPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="OLAS Token"
      description="View live data on token supply, emissions schedules, and other key metrics on Olas. Visual charts and statistics to help you track and analyze important trends."
    />
    <OlasToken metrics={metrics} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'other' });
  return {
    props: {
      metrics: snapshot?.data || null,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default OlasTokenPage;
