import { HEADER_LARGE_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const Header = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-b-1.5" backgroundType="SUBTLE_GRADIENT">
    <div className={`${HEADER_LARGE_CLASS}`}>
      <h1 className="text-center">Olas Timeline</h1>
    </div>
  </SectionWrapper>
);
