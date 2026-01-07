import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';

const HeroImage = () => (
  <Image
    src="/images/agents/babydegen/babydegen.png"
    alt="Baby Degen"
    width={400}
    height={400}
    className="mx-auto rounded-lg"
  />
);

const ExploreBabydegens = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#agents">Explore Babydegens</a>
  </Button>
);

const StepIntoDefAI = (
  <div>
    Step into DeFAI: <br />
    AI agent powered trading
  </div>
);

export const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="BABY DEGEN"
    title={StepIntoDefAI}
    PrimaryButton={ExploreBabydegens}
  />
);
