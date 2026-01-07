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
    get discounted OLAS
  </div>
);

const StartBonding = () => (

  // @ts-expect-error TS(2322) FIXME: Type '{ children: any[]; variant: "default"; size:... Remove this comment to see the full error message
  <Button variant="default" size="xl" asChild className="w-full lg:w-auto">
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'childre'.
    // @ts-expect-error TS(2741): Property 'className' is missing in type '{ childre... Remove this comment to see the full error message
    <SubsiteLink href={BOND_URL} isInButton>
      Start bonding now
    </SubsiteLink>
  </Button>
);

export const Hero = () => (

  // @ts-expect-error TS(2739) FIXME: Type '{ HeroImage: () => Element; pageName: string... Remove this comment to see the full error message
  <HeroSection
    HeroImage={HeroImage}
    pageName="OLAS BOND"
    title={ProvideLiquidity}
    description="Join the Olas ecosystem as a Bonder & get discounted OLAS."
    PrimaryButton={StartBonding}
  />
);
