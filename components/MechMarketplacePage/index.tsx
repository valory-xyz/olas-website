import { BenefitFromMM } from './BenefitFromMM';
import { CTA } from './CTA';
import { Hero } from './Hero';
import { Info } from './Info';
import { MarketplaceMetrics } from './MarketplaceMetrics';
import { MechAgentsInAction } from './MechAgentsInAction';
import { WhyUseMechMarketplace } from './WhyUseMechMarketplace';

const MechMarketplace = ({ metrics, snapshotTimestamp }) => (
  <>
    <Hero />
    <MarketplaceMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
    <Info />
    <WhyUseMechMarketplace />
    <BenefitFromMM />
    <MechAgentsInAction />
    <CTA />
  </>
);

export default MechMarketplace;
