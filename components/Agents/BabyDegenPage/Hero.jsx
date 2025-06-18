import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';

const HeroImage = () => (
  <Image
    src="/images/agents/babydegen/babydegen.png"
    alt="Baby Degen"
    width={400}
    height={400}
    className="mx-auto rounded-lg"
  />
);

const ExploreBabydegens = () => (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#agents">Explore Babydegens</a>
  </Button>
);

const StepIntoDefAI = (
  <div>
    Step into DeFAI: <br />
    AI agent powered trading
  </div>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="BABY DEGEN"
    title={StepIntoDefAI}
    PrimaryButton={ExploreBabydegens}
  />
);
