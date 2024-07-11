import { HEADER_LARGE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const PredictHeader = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className={`${HEADER_LARGE_CLASS}`}>
      <h2 className="text-center">Olas Predict</h2>
    </div>
  </SectionWrapper>
);
