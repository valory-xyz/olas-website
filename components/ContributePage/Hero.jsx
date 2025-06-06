import Image from 'next/image';
import Link from 'next/link';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { CTA_LINK } from './utils';

const HeroImage = () => (
  <Image
    src="/images/services/contribute/hero.svg"
    alt="Olas contribute hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const PostAboutOlas = (
  <div>
    Post about Olas, <br />
    earn rewards
  </div>
);

const StartContributing = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href={CTA_LINK}>Start Contributing</Link>
  </Button>
);

const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS CONTRIBUTE"
    title={PostAboutOlas}
    description="Spread the word about Olas and earn OLAS for your contributions."
    PrimaryButton={StartContributing}
  />
);

export default Hero;
