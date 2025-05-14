import { FAQ } from './FAQ';
import Hero from './Hero';
import { InstallRunAnAgent } from './InstallRunAnAgent';
import { MeetPearl } from './MeetPearl';
import { PearlMetrics } from './PearlMetrics';
import { WantToBuild } from './WantToBuild';
import { WhyRunPearl } from './WhyRunPearl';

const Pearl = () => (
  <>
    <Hero />
    <InstallRunAnAgent />
    <PearlMetrics />
    <MeetPearl />
    <WhyRunPearl />
    <WantToBuild />
    <FAQ />
  </>
);

export default Pearl;
