import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image src="/images/agent-economies/hero.png" alt="hero" width={648} height={454} />
);

const ExploreAgentEconomies = () => (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#agent-economies">Explore Agent Economies</a>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="AI AGENT ECONOMIES"
    title="AI Agents Collaborate & Compete"
    description="Learn about AI Agent Economies on Olas."
    PrimaryButton={ExploreAgentEconomies}
    backgroundType="GRAY"
    className="bg-gradient-to-t from-slate-100 to-gray-50"
  />
);
