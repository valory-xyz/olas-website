import Image from 'next/image';

import { CONTRIBUTE_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const HeroImage = () => (
  <Image
    src="/images/agents/contribute/hero.svg"
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

  // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
    // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
    <SubsiteLink href={CONTRIBUTE_URL} isInButton>
      Start Contributing
    </SubsiteLink>
  </Button>
);

const Hero = () => (

  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS CONTRIBUTE"
    title={PostAboutOlas}
    description="Spread the word about Olas and earn OLAS for your contributions."
    PrimaryButton={StartContributing}
  />
);

export default Hero;
