import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Link from 'next/link';

export const Hero = () => (
  <SectionWrapper customClasses="bg-[url('/images/academy/hero.png')] bg-center bg-fixed min-h-[500px] h-[90vh] bg-cover place-content-center">
    <div className="flex flex-col gap-8 mx-auto text-center text-white max-md:mx-6">
      <div className="mx-auto rounded-full border border-white/20 px-5 py-3 text-sm font-medium bg-white/10 w-fit transition duration-300 ease-in-out hover:bg-transparent hover:border-transparent cursor-default">
        Olas Dev Academy
      </div>
      <h3 className="font-machina max-md:text-3xl max-lg:text-4xl text-5xl">
        Become an Olas agent Builder
      </h3>
      <span className="text-lg">Learn to build autonomous AI agents</span>
      <Button
        variant="valory"
        size="xl"
        className="my-6 w-fit mx-auto border-valory-green text-valory-green bg-valory-green/5 rounded-none"
      >
        <Link href="#paths">Explore paths</Link>
      </Button>
    </div>
  </SectionWrapper>
);
