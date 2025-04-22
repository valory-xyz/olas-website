import { SECTION_BOX_CLASS } from 'common-util/classes';
import { ComingSoon } from 'components/ComingSoon';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const OptimusAgentMetrics = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} lg:py-14`}>
    <div className="max-w-[750px] mx-auto text-center">
      <ComingSoon text="Olas Optimus Agent economy" />
    </div>
  </SectionWrapper>
);
