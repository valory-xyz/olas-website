import { BondMetrics } from './BondMetrics';
import { Hero } from './Hero';
import { HowBondingWorks } from './HowBondingWorks';
import { UnlockBenefits } from './UnlockBenefits';
import { WhyBondingMatters } from './WhyBondingMatters';

export const Bond = ({ metrics }) => (
  <>
    <Hero />
    <BondMetrics metrics={metrics} />
    <UnlockBenefits />
    <WhyBondingMatters />
    <HowBondingWorks />
  </>
);
