import { BabydegenMetrics } from 'components/AgentEconomies/BabydegenEconomyPage/BabydegenMetrics';
import { Descriptions } from 'components/AgentEconomies/BabydegenEconomyPage/Descriptions';
import { Hero } from 'components/AgentEconomies/BabydegenEconomyPage/Hero';
import { HowBabydegenEconomyWorks } from 'components/AgentEconomies/BabydegenEconomyPage/HowBabydegenEconomyWorks';
import { Join } from 'components/AgentEconomies/BabydegenEconomyPage/Join';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

import { REVALIDATE_DURATION } from 'common-util/constants';
import { getSnapshot } from 'common-util/snapshot-storage';

const Optimus = ({ metrics }) => (
  <PageWrapper>
    <Meta
      pageTitle="Babydegen Economy"
      description="Discover autonomous AI agents trading across DeFi with Olas—managing assets and evolving 24/7. Join the future of decentralized finance today."
    />
    <Hero />
    <BabydegenMetrics metrics={metrics} />
    <Descriptions />
    <HowBabydegenEconomyWorks />
    <Join />
    {/* <GetInvolved /> */}
  </PageWrapper>
);

export const getStaticProps = async () => {
  const snapshot = await getSnapshot({ category: 'agent-economies' });
  const metrics = snapshot?.data?.babyDegen || null;

  return {
    props: {
      metrics,
    },
    revalidate: REVALIDATE_DURATION,
  };
};

export default Optimus;
