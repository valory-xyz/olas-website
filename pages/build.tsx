import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';
import Build from 'components/BuildPage';
import { InfoNotice } from 'components/InfoNotice';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const BuildPage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Build"
      description="Build on the Olas protocol: create AI agents and contribute code. Builders may earn Dev Rewards when developer incentives are active."
    />
    <Build metrics={metrics} />
    <InfoNotice />
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
