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

const RunAIAgents = (
  <div>
    Run AI Agents,
    <br /> Earn Rewards
  </div>
);

const Explore = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href="#get-started">Explore Operator Role</Link>
  </Button>
);

export const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS OPERATE"
    title={RunAIAgents}
    PrimaryButton={Explore}
  />
);
