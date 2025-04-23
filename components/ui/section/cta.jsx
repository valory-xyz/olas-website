import SectionWrapper from 'components/Layout/SectionWrapper';
import PropTypes from 'prop-types';
import { Button } from '../button';

export const CTASection = ({ text, ctaUrl, ctaText }) => (
  <SectionWrapper
    customClasses="px-8 py-12 lg:p-20 border-y"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center gap-8 flex flex-col">
        <div className="text-purple-700 font-medium italic">{text}</div>
        <Button variant="default" size="xl" asChild className="w-fit mx-auto">
          <a href={ctaUrl}>{ctaText}</a>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);

CTASection.propTypes = {
  ctaText: PropTypes.string.isRequired,
  ctaUrl: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
};
