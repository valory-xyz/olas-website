import { BondMetrics } from './BondMetrics';
import { Hero } from './Hero';
import { HowBondingWorks } from './HowBondingWorks';
import { UnlockBenefits } from './UnlockBenefits';
import { WhyBondingMatters } from './WhyBondingMatters';

export const Bond = ({ metrics, snapshotTimestamp }) => (
  <>
    <Hero />
    <BondMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
    <UnlockBenefits />
    <WhyBondingMatters />
    <HowBondingWorks />
  </>
);
