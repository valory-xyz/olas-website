import Image from 'next/image';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/prediction-agents-page/hero.png"
    alt="hero"
    width={400}
    height={400}
    className="ml-auto"
  />
);

export const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 md:gap-8 md:grid-cols-12 lg:items-center xl:gap-0">
      <div className="px-0 md:mb-12 md:col-span-7 lg:px-5">
        <div className="md:hidden mb-8">
          <HeroImage />
        </div>
        <h1
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          PREDICTION AGENTS
        </h1>
        <h2
          className={`${MAIN_TITLE_CLASS} max-w-[650px] max-md:mb-6 md:my-6 lg:my-auto`}
        >
          Trade in Prediction Markets — Without Lifting a Finger
        </h2>

        <div>
          <Button
            variant="default"
            size="xl"
            asChild
            className="grow max-md:w-full"
          >
            <a href="#get-started">Explore</a>
          </Button>
        </div>
      </div>

      <div className="hidden flex lg:mt-0 md:col-start-8 md:col-span-5 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);
