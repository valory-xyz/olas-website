import Image from 'next/image';
import Link from 'next/link';

import { LAUNCH_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/launch-page/hero.png"
    alt="Olas launch hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const LaunchNow = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href={LAUNCH_URL}>Launch now</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS LAUNCH"
    title="Launch your own agent economy with ease"
    description="Everything you need to bring AI agent economies to your ecosystem."
    PrimaryButton={LaunchNow}
  />
);
