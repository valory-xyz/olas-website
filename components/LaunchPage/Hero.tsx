import Image from 'next/image';

import { LAUNCH_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

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
    <SubsiteLink href={LAUNCH_URL} isInButton>
      Launch now
    </SubsiteLink>
  </Button>
);

export const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS LAUNCH"
    title="Launch your own agent economy with ease"
    description="Everything you need to bring AI agent economies to your ecosystem."
    PrimaryButton={LaunchNow}
  />
);
