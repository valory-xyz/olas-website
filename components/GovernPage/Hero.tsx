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

  // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
    // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
    <SubsiteLink href={GOVERN_URL} isInButton>
      Start governing now
    </SubsiteLink>
  </Button>
);

export const Hero = () => (

  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS GOVERN"
    title="Direct the future of Olas"
    description="Join the decision-making process that drives growth in the Olas ecosystem."
    PrimaryButton={StartGoverning}
  />
);
