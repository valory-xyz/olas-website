import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import { Govern } from 'components/GovernPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const GovernPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Govern"
      description="Join Olas’ decision-making process. Shape the future of AI agents and the crypto ecosystem. Become an Olas Governor and drive growth."
    />
    <Govern metrics={metrics} />
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

export default GovernPage;
