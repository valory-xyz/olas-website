import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Link from 'next/link';
import SectionHeading from '../SectionHeading';

const Hero = () => (
  <SectionWrapper
    customClasses="py-16 border-b min-h-[800px]"
    backgroundType="NONE"
    backgroundImage="/images/homepage/hero.png"
  >
    <div className="flex flex-col justify-center items-center max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 ">
      <div className="text-center px-5 lg:p-0 mb-12 my-auto">
        <SectionHeading
          size="text-6xl sm:text-7xl lg:text-5xl xl:text-7xl lg:mb-6 font-extrabold"
          color="text-gray-900"
        >
          Co-own AI
        </SectionHeading>
        <p className="mb-6 text-xl  text-gray-900 max-w-[512px]">
          Olas enables everyone to own a share of AI, specifically autonomous
          agent economies.
        </p>
        <Button variant="default" size="xl" asChild>
          <Link href="#get-involved">Get involved</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
