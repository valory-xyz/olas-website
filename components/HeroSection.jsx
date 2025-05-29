import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from './Layout/SectionWrapper';

export const HeroSection = ({
  image,
  pageName,
  title,
  description,
  primaryButton,
  secondaryButton,
}) => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="flex justify-between max-w-screen-xl items-start mx-auto xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="px-0 lg:col-span-5 lg:px-5 lg:text-left max-w-2xl h-full my-auto">
        <div className="md:hidden mb-8">{image}</div>

        <h1
          className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left max-sm:text-base`}
        >
          {pageName}
        </h1>

        <h2 className={`${MAIN_TITLE_CLASS} mb-4`}>{title}</h2>

        {description && (
          <div className={`${TEXT_SMALL_CLASS} mb-6`}>{description}</div>
        )}

        <div className="flex flex-wrap justify-stretch gap-6">
          {primaryButton}
          {secondaryButton}
        </div>
      </div>

      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        {image}
      </div>
    </div>
  </SectionWrapper>
);
