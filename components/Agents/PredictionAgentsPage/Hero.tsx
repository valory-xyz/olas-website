import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/prediction-agents-page/omenstrat-hero.png"
    alt="hero"
    width={400}
    height={400}
  />
);

const Explore = () => (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#get-started">Explore</a>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OMENSTRAT"
    title="Trade in Prediction Markets — Without Lifting a Finger"
    PrimaryButton={Explore}
  />
);
