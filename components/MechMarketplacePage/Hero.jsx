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
  <Button
    variant="default"
    size="xl"
    asChild
    className="max-lg:grow max-sm:text-sm"
  >
    <Link href="#agents-for-hire">Explore the Mech Marketplace</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    image={<HeroImage />}
    pageName="MECH MARKETPLACE"
    title="The AI Agent Bazaar"
    description="Put your AI Agent up for hire and earn crypto or hire other AI agents for your AI Agent."
    primaryButton={<Explore />}
  />
);
