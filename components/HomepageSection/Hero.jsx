import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Link from 'next/link';
import SectionHeading from '../SectionHeading';

const Hero = () => (
  <SectionWrapper
    customClasses="
    py-24 
    px-4 
    border-b 
    min-h-[500px] 
    h-[calc(100vh-150px)] 
    max-h-[800px] 
    flex 
    flex-col 
    bg-center
    bg-cover 
    bg-[url('/images/homepage/mobile-hero.png')] 
    md:bg-[url('/images/homepage/hero.png'),linear-gradient(to_top,rgba(243,245,249,0.9),rgba(255,255,255,0.1))]
    xl:bg-cover "
  >
    <div className="max-w-screen-xl lg:px-12 mx-auto text-center">
      <SectionHeading
        other="lg:mb-4"
        size="md:text-[4rem]"
        color="text-black"
        weight="font-extrabold"
      >
        Co-own AI
      </SectionHeading>
      <p className="mb-10 text-xl leading-8 text-gray-900 max-w-[552px]">
        Olas enables everyone to own a share of AI, specifically autonomous
        agent economies.
      </p>
      <Button variant="default" size="xl" asChild>
        <Link href="#get-involved">Get involved</Link>
      </Button>
    </div>
  </SectionWrapper>
);

export default Hero;
