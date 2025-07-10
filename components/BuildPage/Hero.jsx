import Image from 'next/image';

import { REGISTRY_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

const HeroImage = () => (
  <Image
    src="/images/build-page/hero.svg"
    alt="hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const GetStarted = () => (
  <Button variant="default" size="xl" asChild className="grow">
    <a href="#get-started">Get started</a>
  </Button>
);

const Explore = () => (
  <Button variant="ghostPrimary" size="xl" asChild className="grow">
    <SubsiteLink href={`${REGISTRY_URL}/ethereum/agents`}>
      Explore minted agents
    </SubsiteLink>
  </Button>
);

const BuildAgents = (
  <div>
    Build agents,
    <br />
    get rewarded
  </div>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS BUILD"
    title={BuildAgents}
    description="Build on the Olas protocol and earn Dev Rewards, or get paid by contributing to external projects."
    PrimaryButton={GetStarted}
    SecondaryButton={Explore}
  />
);
