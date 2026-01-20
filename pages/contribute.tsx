import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import Contribute from 'components/ContributePage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const ContributePage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Contribute"
      description="Enhance your network’s impact with Olas Contribute. Track and amplify contributions in crypto and AI with autonomous AI services."
    />
    <Contribute metrics={metrics} />
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

export default ContributePage;
