import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import { Button } from 'components/ui/button';
import SectionHeading from '../SectionHeading';

const Hero = () => (
  <SectionWrapper customClasses="py-16 border-b" backgroundType="SUBTLE_GRADIENT">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <SectionHeading size="text-6xl sm:text-7xl lg:text-5xl xl:text-7xl lg:mb-6 font-extrabold" color="text-gray-900">
          Co-own AI
        </SectionHeading>
        <p className="mb-6 text-xl font-light text-gray-900">
          Olas enables everyone to own a share of AI, specifically autonomous agent economies.
        </p>
        <Button variant="default" size="xl" asChild>
          <a href="#get-involved">
            Get involved
          </a>
        </Button>
      </div>
      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image src="/images/co-own-ai.png" alt="hero" width={834} height={742} className="mx-auto w-3/4 xl:w-full" />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
