import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/prediction-agents-page/hero.png"
    alt="hero"
    width={400}
    height={400}
  />
);

const Explore = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#get-started">Explore</a>
  </Button>
);

export const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="PREDICTION AGENTS"
    title="Trade in Prediction Markets — Without Lifting a Finger"
    PrimaryButton={Explore}
  />
);
