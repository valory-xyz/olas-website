import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/pearl-page/hero-image.png"
    alt="Pearl hero"
    width={513}
    height={480}
    className="mx-auto xl:w-full"
  />
);

const TryPearlNow = () => (
  <Button variant="default" size="xl" asChild className="mb-6 w-full md:w-auto">
    <Link href="#download">Try Pearl now</Link>
  </Button>
);

const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS PEARL"
    title="The Agent App Store"
    description="A world of AI agents in one app — the Agent App Store, working for you and earning you rewards."
    PrimaryButton={TryPearlNow}
  />
);

export default Hero;
