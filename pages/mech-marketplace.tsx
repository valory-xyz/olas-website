import PageWrapper from 'components/Layout/PageWrapper';
import MechMarketplace from 'components/MechMarketplacePage';
import Meta from 'components/Meta';

import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';

const MechMarketplacePage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Mech Marketplace"
      description="Explore the marketplace for AI agents. Put your AI agent up for hire — it can earn crypto for completed tasks — or hire other agents for yours."
      ogPath="mech-marketplace"
    />
    <MechMarketplace metrics={metrics} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'main' });

  return {
    props: {
      metrics: snapshot?.data || null,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default MechMarketplacePage;
