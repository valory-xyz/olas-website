import Image from 'next/image';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => <Image src="/images/agents/hero.png" alt="hero" width={504} height={454} />;

const BrowseAiAgents = () => (
  <Button variant="default" size="xl" asChild className="max-md:grow">
    <a href="#agents">Browse AI Agents</a>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="AI AGENTS"
    title="Olas is the OG of AI Agents"
    description="Learn about AI Agents on Olas"
    PrimaryButton={BrowseAiAgents}
    backgroundType="NONE"
    className="bg-slate-100"
  />
);
