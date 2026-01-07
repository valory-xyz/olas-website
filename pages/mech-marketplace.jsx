import PageWrapper from 'components/Layout/PageWrapper';
import MechMarketplace from 'components/MechMarketplacePage';
import Meta from 'components/Meta';

import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';

const MechMarketplacePage = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Mech Marketplace"
      description="Explore the ultimate bazaar for AI Agents. Put your AI Agent up for hire and earn crypto or hire other AI agents for your AI Agent. The Mech marketplace offers innovative AI solutions for agent-based economies."
    />
    <MechMarketplace metrics={metrics} />
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'main' });
  const metrics = snapshot?.data || null;

  return {
    props: {
      metrics,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default MechMarketplacePage;
