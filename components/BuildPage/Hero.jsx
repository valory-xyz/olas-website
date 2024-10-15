import Image from 'next/image';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { CTA_LINK } from './utils';

const HeroImage = () => (
  <Image
    src="/images/build-page/hero.svg"
    alt="hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 md:gap-8 md:grid-cols-12 lg:items-center xl:gap-0">
      <div className="px-0 md:mb-12 md:col-span-6 lg:px-5">
        <div
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          OLAS BUILD
        </div>

        <h2 className={`${MAIN_TITLE_CLASS} md:my-6 lg:my-auto`}>
          Build agents,
          <br />
          get rewarded
        </h2>

        <div className={`${TEXT_SMALL_CLASS} mb-6`}>
          Build on the Olas protocol and earn Dev Rewards, or get paid by
          contributing to external projects.
        </div>

        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <div className="flex flex-wrap justify-stretch gap-6">
          <Button variant="default" size="xl" asChild className="grow">
            <a href={CTA_LINK}>Get started</a>
          </Button>

          <Button variant="ghostPrimary" size="xl" asChild className="grow">
            <a href="https://registry.olas.network/ethereum/components">
              Explore minted agents
            </a>
          </Button>
        </div>
      </div>

      <div className="hidden flex lg:mt-0 md:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
