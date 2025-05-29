import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/babydegen-econ-page/hero.png"
    alt="hero"
    width={464}
    height={432}
  />
);

const RunAnAgent = () => (
  <Button variant="default" size="xl" asChild className="grow max-md:w-full">
    <a href="#join-the-agent-economy">Run an Agent</a>
  </Button>
);

const LearnHowItWorks = () => (
  <Button variant="ghostPrimary" size="xl" asChild className="grow">
    <Link href="#how-it-works">Learn How it Works</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="BABYDEGEN ECONOMY"
    title="The First AI Trading Economy Built on Autonomous Agents"
    description="A network of autonomous AI trading agents navigating DeFi ecosystems,
          powered by Olas — managing assets, adapting strategies, and evolving
          24/7 without human input."
    PrimaryButton={RunAnAgent}
    SecondaryButton={LearnHowItWorks}
  />
);
