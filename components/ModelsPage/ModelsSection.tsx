import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ModelsCarousel } from 'components/ModelsPage/ModelsCarousel';
import SectionHeading from 'components/SectionHeading';

export const ModelsSection = () => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses={`${SECTION_BOX_CLASS} bg-slate-100`}
    id="models"
  >
    <div className="max-w-4xl mx-auto flex flex-col">
      <SectionHeading spacing="mb-14" other="text-center">
        Available Models
      </SectionHeading>
      <ModelsCarousel />
    </div>
  </SectionWrapper>
);
