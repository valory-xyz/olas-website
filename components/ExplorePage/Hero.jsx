import React from 'react';
import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import {
  MAIN_TITLE_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import { H1 } from 'components/ui/typography';

const HeaderLeftContent = () => (
    <div className="lg:col-span-6 px-5 lg:p-0 lg:text-left w-auto mb-12">
      <div className={TEXT_MEDIUM_LIGHT_CLASS}>USE CASES</div>
      <H1 className={`${MAIN_TITLE_CLASS} mb-6`}>
        Expanding what's possible
      </H1>
  
      <p className={`${TEXT_SMALL_CLASS} mb-8 lg:w-5/6`}>
      The impact of autonomous agent economies is shaping applications and products in Web3 and far beyond.
      </p>
  
      <Button
        variant="default"
        size="xl"
        asChild
        className=" flex lg:inline-flex lg:w-auto "
      >
        <a href="#use-cases">
          Explore use cases
        </a>
      </Button>
    </div>
  );
  
  const HeaderRightContent = () => (
    <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
      <Image
        src="/images/use-cases.png"
        alt="Use Cases"
        width={400}
        height={400}
        className="mx-auto rounded-lg"
      />
    </div>
  );

const Hero = () => (
  <SectionWrapper customClasses="border-b">
    <div className="max-w-screen-xl xl:gap-0 lg:gap-8 lg:grid-cols-12 lg:px-16 grid mx-auto my-24 items-center">
      <HeaderLeftContent />
      <HeaderRightContent />
    </div>
  </SectionWrapper>
);

export default Hero;