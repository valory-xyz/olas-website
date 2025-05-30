import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Link from 'next/link';

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
    bg-no-repeat
    bg-[url('/images/homepage/mobile-hero.png'),linear-gradient(to_top,rgba(243,245,249,0.9),rgba(255,255,255,0.1))]
    md:bg-[url('/images/homepage/hero.png'),linear-gradient(to_top,rgba(243,245,249,0.9),rgba(255,255,255,0.1))]
    md:bg-auto
    xl:bg-cover "
  >
    <div className="max-w-screen-xl lg:px-12 mx-auto text-center">
      <h1 className="tracking-tight text-4xl md:text-6xl max-sm:text-6xl md:text-[4rem] mb-12 text-black  font-extrabold lg:mb-4">
        Co-own AI
      </h1>
      <div className="mb-10 text-xl leading-8 text-gray-900">
        Olas enables everyone to own and monetize their AI agents.
      </div>
      <div className="flex gap-8">
        <Button
          variant="default"
          size="xl"
          asChild
          className="hidden md:inline-flex ml-auto"
        >
          <Link href="/pearl">Own Your Agent</Link>
        </Button>
        <Button
          variant="outline"
          size="xl"
          asChild
          className="hidden md:inline-flex ml-auto"
        >
          <Link href="#choose-your-role">Other Ways To Get Involved</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
