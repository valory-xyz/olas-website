import Image from 'next/image';
import Link from 'next/link';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

const HeroImage = () => (
  <Image
    src="/images/govern-page/hero.svg"
    alt="hero"
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
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 mx-auto items-center">
      <div className="px-0 md:mb-12 md:col-span-6 lg:px-5 lg:text-left">
        <div
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2`}
        >
          OLAS GOVERN
        </div>

        <h2 className={`${MAIN_TITLE_CLASS} md:my-6 lg:my-auto mb-6`}>Direct the future of Olas</h2>

        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <p className={`${TEXT_SMALL_CLASS} text-left`}>
          Join the decision-making process that drives growth in the Olas
          ecosystem.
        </p>

        <Button
          variant="default"
          size="xl"
          asChild
          className="my-6 w-full md:w-auto"
        >
          <Link href="https://govern.olas.network">Start governing now</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 md:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);
