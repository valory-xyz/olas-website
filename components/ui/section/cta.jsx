import PropTypes from 'prop-types';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';

export const CTASection = ({ heading, ctaUrl, ctaText }) => (
  <SectionWrapper
    customClasses="px-8 py-12 lg:p-24 border-y"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <SectionHeading
          color="text-purple-950"
          size="text-4xl md:text-6xl lg:text-4xl"
        >
          {heading}
        </SectionHeading>
        <a
          href={ctaUrl}
          className="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
        >
          {ctaText}
        </a>
      </div>
    </div>
  </SectionWrapper>
);

CTASection.propTypes = {
  ctaText: PropTypes.string.isRequired,
  ctaUrl: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
};
