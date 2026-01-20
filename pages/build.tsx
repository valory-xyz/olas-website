import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import Build from 'components/BuildPage';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BuildPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Build"
      description="Build on Olas protocol, earn Dev Rewards, create AI agents, or contribute to crypto projects. Become an Olas Builder and get paid."
    />
    <Build metrics={metrics} />
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

export default BuildPage;
