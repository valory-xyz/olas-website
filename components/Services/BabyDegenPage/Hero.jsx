import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';

const HeroImage = (
  <Image
    src="/images/services/babydegen/babydegen.png"
    alt="Baby Degen"
    width={400}
    height={400}
    className="mx-auto rounded-lg"
  />
);

const ExploreBabydegens = (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#meet-the-babydegens">Explore Babydegens</a>
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
    image={HeroImage}
    pageName="BABY DEGEN"
    title={StepIntoDefAI}
    button={ExploreBabydegens}
  />
);
