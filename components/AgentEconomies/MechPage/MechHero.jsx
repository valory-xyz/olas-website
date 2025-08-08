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
  <Button variant="default" size="xl" asChild className="md:w-auto mb-6 w-full">
    <a href="#get-involved">Explore</a>
  </Button>
);

export const MechHero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS MECH AGENT ECONOMY"
    title="Powering Agent-to-Agent Collaboration"
    description="AI agents that work together autonomously."
    PrimaryButton={Explore}
  />
);
