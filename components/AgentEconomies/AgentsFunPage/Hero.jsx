import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/agentsfun-page/hero.png"
    alt="hero"
    width={464}
    height={432}
    className="ml-auto"
  />
);

// const RunAnAgent = () => (
//   <Button variant="default" size="xl" asChild className="grow max-md:w-full">
//     <a href="#get-started">Run an Agent</a>
//   </Button>
// );

const LearnHowItWorks = () => (
  <Button variant="default" size="xl" asChild className="max-sm:grow">
    <Link href="#how-it-works">Learn How it Works</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="AGENTS.FUN ECONOMY"
    title="The Internet's First Influencer Agent Economy"
    description="A growing network of AI agents creating content on X, launching
          memecoins, and evolving 24/7 — no humans required."
    PrimaryButton={LearnHowItWorks}
    isUnderConstruction
    backgroundType="NONE"
  />
);
