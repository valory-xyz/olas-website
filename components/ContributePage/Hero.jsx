import Image from 'next/image';
import Link from 'next/link';

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
    src="/images/services/contribute/hero.svg"
    alt="Olas contribute hero"
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
      <div className="px-0 md:mb-12 md:col-span-6 lg:px-5 lg:text-left">
        <h1 className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left`}>
          OLAS CONTRIBUTE
        </h1>

        <h2 className={`${MAIN_TITLE_CLASS} md:my-6 lg:my-auto text-left mb-6`}>
          Post about Olas, <br />
          earn rewards
        </h2>

        <div className={TEXT_SMALL_CLASS}>
          Spread the word about Olas and earn OLAS for your contributions.
        </div>

        <div className="md:hidden">
          <HeroImage />
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="my-6 w-full md:w-auto"
        >
          <Link href={CTA_LINK}>Start Contributing</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 md:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
