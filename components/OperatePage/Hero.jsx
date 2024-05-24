import React from 'react';
import Image from 'next/image';
import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { FOOT_NOTE_CLASS, SECTION_BOX_CLASS, TEXT_LIGHT_CLASS } from './utils';

const OperateHeroImage = () => (
  <Image
    src="/images/operate-page/operate-hero.png"
    alt="hero"
    width={638}
    height={596}
    className="mx-auto xl:w-full"
  />
);

const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="px-5 md:mb-12 lg:col-span-5 lg:p-0 lg:text-left">
        <div className={`${TEXT_LIGHT_CLASS} mb-2 text-left`}>OLAS OPERATE</div>

        <h2
          className="leading-5 font-bold text-3xl sm:text-4xl lg:mb-8 lg:text-4xl xl:text-5xl xl:leading-5"
          style={{ lineHeight: '120%' }}
        >
          Run agents, stake & earn rewards*
        </h2>

        <div className="md:hidden mb-8">
          <OperateHeroImage />
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="mb-6 w-full md:w-auto"
        >
          <Link href="/operate#download">
            <DownloadIcon className="mr-2" />
            Download Pearl - Alpha
          </Link>
        </Button>

        <div className={FOOT_NOTE_CLASS}>
          * rewards are dependent on individual agent implementations as well as
          operator performance.
        </div>
      </div>

      <div className="hidden sm:block col-span-1" />

      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        <OperateHeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
