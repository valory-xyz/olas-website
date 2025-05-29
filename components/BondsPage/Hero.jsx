import Image from 'next/image';
import Link from 'next/link';

import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/bonds-page/hero.svg"
    alt="Olas bonds hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const ProvideLiquidity = () => (
  <div>
    Provide liquidity,
    <br />
    get discounted OLAS
  </div>
);

const StartBonding = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <Link href="https://bond.olas.network/">Start bonding now</Link>
  </Button>
);

export const Hero = () => (
  <HeroSection
    image={<HeroImage />}
    pageName="OLAS BOND"
    title={<ProvideLiquidity />}
    description="Join the Olas ecosystem as a Bonder & get discounted OLAS."
    primaryButton={<StartBonding />}
  />
);
