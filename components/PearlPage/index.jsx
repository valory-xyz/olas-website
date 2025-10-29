import { Benefits } from './Benefits';
import { FAQ } from './FAQ';
import Hero from './Hero';
import { InstallRunAnAgent } from './InstallRunAnAgent';
import { MeetPearl } from './MeetPearl';
import { PearlMetrics } from './PearlMetrics';
import { WantToBuild } from './WantToBuild';

const Pearl = () => (
  <>
    <Hero />
    <PearlMetrics />
    <MeetPearl />
    <Benefits />
    <InstallRunAnAgent />
    <WantToBuild />
    <FAQ />
  </>
);

export default Pearl;
