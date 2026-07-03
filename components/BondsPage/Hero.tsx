import Image from 'next/image';

import { BOND_URL } from 'common-util/constants';
import { HeroSection } from 'components/HeroSection';
import { Button } from 'components/ui/button';
import { SubsiteLink } from 'components/ui/typography';

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
    get OLAS in return
  </div>
);

const StartBonding = () => (
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    <SubsiteLink href={BOND_URL} isInButton>
      View bonding programs
    </SubsiteLink>
  </Button>
);

export const Hero = () => (
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS BOND"
    title={ProvideLiquidity}
    description="Join the Olas ecosystem as a Bonder & receive OLAS in return for LP tokens, when bonding programs are open."
    PrimaryButton={StartBonding}
  />
);
