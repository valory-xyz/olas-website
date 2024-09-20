import PropTypes from 'prop-types';
import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { H1 } from '../typography';

export const HowToSection = ({ sectionId, heading, image, body }) => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
    {sectionId && <div id={sectionId} />}
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 px-5 lg:p-0 mb-12">
        <H1 className="mb-8">{heading}</H1>
        {body.steps && (
          <ol className="text-xl list-decimal mb-6 pl-5 leading-loose">
            {body.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
        {body.extra && <div className="text-slate-500">{body.extra}</div>}
      </div>
      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          className="mx-auto rounded-lg shadow-sm border"
          alt={image.alt}
          src={image.path}
          width={image.width}
          height={image.height}
        />
      </div>
    </div>
  </SectionWrapper>
);

HowToSection.propTypes = {
  body: PropTypes.shape({
    extra: PropTypes.element,
    steps: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  heading: PropTypes.string.isRequired,
  image: PropTypes.shape({
    alt: PropTypes.string,
    height: PropTypes.number,
    path: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
  sectionId: PropTypes.string.isRequired,
};
