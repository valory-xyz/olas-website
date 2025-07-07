import Image from 'next/image';

import { BOND_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';

const HeroImage = () => (
  <Image
    src="/images/bonds-page/hero.svg"
    alt="Olas bonds hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const ProvideLiquidity = (
  <div>
    Provide liquidity,
    <br />
    get discounted OLAS
  </div>
);

const StartBonding = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <ExternalLink href={BOND_URL} className="text-white" hideArrow>
      Start bonding now
    </ExternalLink>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS BOND"
    title={ProvideLiquidity}
    description="Join the Olas ecosystem as a Bonder & get discounted OLAS."
    PrimaryButton={StartBonding}
  />
);
