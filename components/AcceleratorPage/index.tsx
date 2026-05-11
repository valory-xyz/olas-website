import { EvaluationCriteria } from './EvaluationCriteria';
import { Hero } from './Hero';
import { HowDoesAcceleratorWork } from './HowDoesAcceleratorWork';
import { WhatIsPearl } from './WhatIsPearl';

const Accelerator = () => (
  <>
    <Hero />
    <WhatIsPearl />
    <HowDoesAcceleratorWork />
    {/* <HowToApply /> */}
    <EvaluationCriteria />
    {/* <CTA /> */}
  </>
);

export default Accelerator;
