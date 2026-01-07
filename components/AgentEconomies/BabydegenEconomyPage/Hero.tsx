import Image from 'next/image';

import { PEARL_YOU_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/babydegen-econ-page/hero.png"
    alt="hero"
    width={464}
    height={432}
  />
);

const RunAnAgent = () => (
  <Button variant="default" size="xl" asChild className="grow max-md:w-full">
    <SubsiteLink href={PEARL_YOU_URL} isInButton>
      Run an Agent
    </SubsiteLink>
  </Button>
);

const LearnHowItWorks = () => (
  <Button variant="ghostPrimary" size="xl" asChild className="grow">
    <Link href="#about">Learn How it Works</Link>
  </Button>
);

export const Hero = () => (
  <>
    {/* @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message */}
    <HeroSection
      HeroImage={HeroImage}
      pageName="BABYDEGEN ECONOMY"
      title="The First AI Trading Economy Built on Autonomous Agents"
      description="A network of autonomous AI trading agents navigating DeFi ecosystems,
          powered by Olas — managing assets, adapting strategies, and evolving
          24/7 without human input."
      PrimaryButton={RunAnAgent}
      SecondaryButton={LearnHowItWorks}
    />
  </>
);
