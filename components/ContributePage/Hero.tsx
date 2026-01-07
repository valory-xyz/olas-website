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
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
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
