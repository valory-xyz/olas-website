import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/olas-token-page/hero.png"
    alt="hero"
    width={500}
    height={500}
    className="mx-auto"
  />
);

const GetOlas = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href="#token-details">Get OLAS</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS TOKEN"
    title="Unlock the Olas Network"
    description="OLAS token provides access to the core functions of the network."
    PrimaryButton={GetOlas}
  />
);
