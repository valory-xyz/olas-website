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
    <Link href="#download">Own Your Agent</Link>
  </Button>
);

const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS PEARL"
    title='The "AI Agent App Store"'
    description="A world of AI agents owned by you — in one app. "
    PrimaryButton={TryPearlNow}
  />
);

export default Hero;
