import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  TEXT_SMALL_CLASS,
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';

const HeroImage = () => (
  <Image
    src="/images/launch-page/hero.png"
    alt="Olas launch hero"
    width={464}
    height={432}
    className="mx-auto"
  />
);

export const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 md:gap-8 md:grid-cols-12 lg:items-center xl:gap-0">
      <div className="px-0 md:mb-12 md:col-span-6 lg:px-5 lg:text-left">
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left`}>
          OLAS LAUNCH
        </div>

        <h2 className={`${MAIN_TITLE_CLASS} md:my-6 lg:my-auto`}>
          Launch your own agent economy with ease
        </h2>

        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <div className={TEXT_SMALL_CLASS}>
          Everything you need to bring AI agent economies to your ecosystem.
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="my-6 w-full md:w-auto"
        >
          <Link href="https://launch.olas.network/">Launch now</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 md:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);
