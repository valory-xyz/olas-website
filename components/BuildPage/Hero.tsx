import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/build-page/hero.svg"
    alt="hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const GetStarted = () => (
  <Button variant="default" size="xl" asChild>
    <a href="#why-build">Get started</a>
  </Button>
);

const BuildAgents = (
  <div>
    Build agents,
    <br />
    get rewarded
  </div>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS BUILD"
    title={BuildAgents}
    description="Build on the Olas protocol and earn Dev Rewards, or get paid by contributing to external projects."
    PrimaryButton={GetStarted}
  />
);
