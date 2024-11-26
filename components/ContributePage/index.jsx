import Benefits from './Benefits';
import Content from './Content';
import Contribute from './Contribute';
import { ContributeMetrics } from './ContributeMetrics';
import Features from './Features';
import Hero from './Hero';
import NetworkRole from './NetworkRole';

const ContributePage = () => (
  <>
    <Hero />
    <ContributeMetrics />
    <Benefits />
    <Features />
    <Content />
    <NetworkRole />
    <Contribute />
  </>
);

export default ContributePage;
