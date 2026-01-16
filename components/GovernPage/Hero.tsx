import Image from 'next/image';

import { GOVERN_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const HeroImage = () => (
  <Image
    src="/images/govern-page/hero.svg"
    alt="hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const StartGoverning = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <SubsiteLink href={GOVERN_URL} isInButton>
      Start governing now
    </SubsiteLink>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS GOVERN"
    title="Direct the future of Olas"
    description="Join the decision-making process that drives growth in the Olas ecosystem."
    PrimaryButton={StartGoverning}
  />
);
