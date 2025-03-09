import { HEADER_LARGE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const ProtocolHeader = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className={`${HEADER_LARGE_CLASS}`}>
      <h1 className="text-center">Olas Protocol</h1>
    </div>
  </SectionWrapper>
);
