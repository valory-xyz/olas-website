import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/hackathon-page/hero.png"
    alt="hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const GetInvolved = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="grow">
    <a href="#events">Get Involved</a>
  </Button>
);

const LearnToBuild = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "ghostPrimary"... Remove this comment to see the full error message
  <Button variant="ghostPrimary" size="xl" asChild className="grow">
    <Link href="/build">Learn to Build</Link>
  </Button>
);

const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS HACKATHONS"
    title="Hack with Olas: Build the future of AI Agents at Top Hackathons"
    description="Explore all the hackathons around the world where Olas is participating. Find events, build Agents, collect rewards."
    PrimaryButton={GetInvolved}
    SecondaryButton={LearnToBuild}
  />
);

export default Hero;
