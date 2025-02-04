import { FAQ } from './FAQ';
import Hero from './Hero';
import { InstallRunAnAgent } from './InstallRunAnAgent';
import { MeetPearl } from './MeetPearl';
import { OperateMetrics } from './OperateMetrics';
import { WantMoreControl } from './WantMoreControl';
import { WhyRunPearl } from './WhyRunPearl';

const Pearl = () => (
  <>
    <Hero />
    <OperateMetrics />
    <MeetPearl />
    <WhyRunPearl />
    <InstallRunAnAgent />
    <WantMoreControl />
    <FAQ />
  </>
);

export default Pearl;
