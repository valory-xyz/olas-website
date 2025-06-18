import { BabydegenMetrics } from 'components/BabydegenEconomyPage/BabydegenMetrics';
import { Descriptions } from 'components/BabydegenEconomyPage/Descriptions';
import { Hero } from 'components/BabydegenEconomyPage/Hero';
import { HowBabydegenEconomyWorks } from 'components/BabydegenEconomyPage/HowBabydegenEconomyWorks';
import { Join } from 'components/BabydegenEconomyPage/Join';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Optimus = () => (
  <PageWrapper>
    <Meta
      pageTitle="Babydegen Economy"
      description="Discover autonomous AI agents trading across DeFi with Olas—managing assets and evolving 24/7. Join the future of decentralized finance today."
    />
    <Hero />
    <BabydegenMetrics />
    <Descriptions />
    <HowBabydegenEconomyWorks />
    <Join />
    {/* <GetInvolved /> */}
  </PageWrapper>
);

export default Optimus;
