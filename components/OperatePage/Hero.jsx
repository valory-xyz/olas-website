import Image from 'next/image';
import Link from 'next/link';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/operate-page/hero.png"
    alt="Dashboard for managing AI agents in crypto, Operate decentralized AI agents with Olas"
    width={513}
    height={480}
    className="mx-auto xl:w-full"
  />
);

const RunAIAgents = () => (
  <div>
    Run AI Agents,
    <br /> Earn Rewards
  </div>
);

const Explore = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href="/pearl#download">Explore Operator Role</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    image={<HeroImage />}
    pageName="OLAS OPERATE"
    title={<RunAIAgents />}
    primaryButton={<Explore />}
  />
);
