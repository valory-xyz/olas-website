import { FAQ } from './FAQ';
import Hero from './Hero';
import { InstallRunAnAgent } from './InstallRunAnAgent';
import { MeetPearl } from './MeetPearl';
import { OperateMetrics } from './OperateMetrics';
import { WantToBuild } from './WantToBuild';
import { WhyRunPearl } from './WhyRunPearl';

const Pearl = () => (
  <>
    <Hero />
    <InstallRunAnAgent />
    <OperateMetrics />
    <MeetPearl />
    <WhyRunPearl />
    <WantToBuild />
    <FAQ />
  </>
);

export default Pearl;
