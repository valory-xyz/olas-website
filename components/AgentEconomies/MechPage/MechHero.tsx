import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';

const HeroImage = () => (
  <Image
    src="/images/mech-page/hero.png"
    alt="Mech Hero"
    width={500}
    height={500}
    className="xl:w-full mx-auto"
  />
);

const Explore = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="md:w-auto mb-6 w-full">
    <a href="#get-involved">Explore</a>
  </Button>
);

export const MechHero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS MECH AGENT ECONOMY"
    title="Powering Agent-to-Agent Collaboration"
    description="AI agents that work together autonomously."
    PrimaryButton={Explore}
  />
);
