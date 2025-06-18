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

const AIWorkflow = (
  <div>
    AI Workflow for
    <br />
    Agent Economies
  </div>
);

const GetInvolved = () => (
  <Button variant="default" size="xl" asChild className="md:w-auto mb-6 w-full">
    <a href="#get-involved">Get involved</a>
  </Button>
);

export const MechHero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS MECH"
    title={AIWorkflow}
    PrimaryButton={GetInvolved}
  />
);
