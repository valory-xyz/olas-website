import { FAQ } from './FAQ';
import Hero from './Hero';
import { InstallRunAnAgent } from './InstallRunAnAgent';
import { MeetPearl } from './MeetPearl';
import { OperateMetrics } from './OperateMetrics';
import { WantMoreControl } from './WantMoreControl';

const Pearl = () => (
  <>
    <Hero />
    <OperateMetrics />
    <MeetPearl />
    <InstallRunAnAgent />
    <WantMoreControl />
    <FAQ />
  </>
);

export default Pearl;
