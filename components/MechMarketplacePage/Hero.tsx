import { MECH_MARKETPLACE_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/mech-marketplace/hero.png"
    alt="Olas Mech Marketplace"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const Explore = () => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element; variant: "default"; siz... Remove this comment to see the full error message
  <Button
    variant="default"
    size="xl"
    asChild
    className="max-lg:grow max-sm:text-sm"
  >
    <Link href={MECH_MARKETPLACE_URL}>Explore the Mech Marketplace</Link>
  </Button>
);

export const Hero = () => (
  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="MECH MARKETPLACE"
    title="The AI Agent Bazaar"
    description="Monetize your AI agent. Hire or offer AI agent services in the AI agent bazaar."
    PrimaryButton={Explore}
  />
);
