import Image from 'next/image';
import Link from 'next/link';

import { MAIN_TITLE_CLASS, TEXT_SMALL_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SECTION_BOX_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from './utils';

const HeroImage = () => (
  <Image
    src="/images/pearl-page/hero-image.png"
    alt="Pearl hero"
    width={513}
    height={480}
    className="mx-auto xl:w-full"
  />
);

const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="flex justify-between max-w-screen-xl items-start mx-auto xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="px-0 md:mb-12 lg:col-span-5 lg:px-5 lg:text-left">
        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <h1
          className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left max-sm:text-base`}
        >
          OLAS PEARL
        </h1>

        <h2 className={`${MAIN_TITLE_CLASS} lg:whitespace-nowrap mb-2`}>
          The Agent App Store
        </h2>

        <div className={`${TEXT_SMALL_CLASS} mb-6`}>
          A world of AI agents in one app — working for you & earning you
          rewards.
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="mb-6 w-full md:w-auto"
        >
          <Link href="#download">Try Pearl now</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
