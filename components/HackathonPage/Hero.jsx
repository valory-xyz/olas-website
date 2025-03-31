import Image from 'next/image';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/hackathon-page/hero.png"
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
        <h1
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          OLAS HACKATHONS
        </h1>

        <h2 className={`${MAIN_TITLE_CLASS} max-w-[640px] md:my-6 lg:my-auto`}>
          Build the Future of Autonomous AI Agents in Web3
        </h2>

        <div className={`${TEXT_SMALL_CLASS} mb-6`}>
          Join engineering-led events to shape decentralized AI infrastructure.
        </div>

        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <div className="flex flex-wrap justify-stretch gap-6">
          <Button variant="default" size="xl" asChild className="grow">
            <a href="#events">Get Involved</a>
          </Button>

          <Button variant="ghostPrimary" size="xl" asChild className="grow">
            <a
              href="https://docs.olas.network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn to Build
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
