import { GetStarted } from './GetStarted';
import { GovernMetrics } from './GovernMetrics';
import { Hero } from './Hero';
import { ShapeTheFuture } from './ShapeTheFuture';
import { WhyBecomeGovernor } from './WhyBecomeGovernor';

export const Govern = ({ metrics, snapshotTimestamp }) => (
  <>
    <Hero />
    <GovernMetrics metrics={metrics} snapshotTimestamp={snapshotTimestamp} />
    <ShapeTheFuture />
    <WhyBecomeGovernor />
    <GetStarted />
  </>
);
