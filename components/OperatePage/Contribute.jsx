import SectionHeading from '../SectionHeading';
import SectionWrapper from '../Layout/SectionWrapper';
import { CTA } from './utils';

const Contribute = () => (
  <SectionWrapper backgroundType="SUBTLE_GRADIENT">
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <SectionHeading color="text-purple-950" size="text-4xl md:text-6xl lg:text-4xl">
            Run an agent today
          </SectionHeading>
          <a
            href={CTA}
            className="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Operate now
          </a>
        </div>
      </div>
    </section>
  </SectionWrapper>
);

export default Contribute;
