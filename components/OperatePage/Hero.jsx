import React from 'react';
import Image from 'next/image';
import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SECTION_BOX_CLASS } from './utils';

const OperateHeroImage = () => (
  <Image
    src="/images/operate-page/operate-hero.png"
    alt="hero"
    width={638}
    height={596}
    className="mx-auto w-3/4 xl:w-full"
  />
);

const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6 px-5 lg:p-0 lg:text-left md:mb-12">
        <div className="mb-4 text-xl text-left tracking-widest text-slate-700 lg:mb-6">
          OLAS PEARL
        </div>

        <h2 className="font-extrabold tracking-tight text-4xl mb-6 xl:text-6xl lg:mb-12 lg:text-5xl sm:text-5xl">
          Run agents, stake & earn rewards*
        </h2>

        <div className="md:hidden mb-8">
          <OperateHeroImage />
        </div>

        <Button variant="default" size="xl" asChild className="mb-12">
          <Link href="/operate#download">
            <DownloadIcon className="mr-2" />
            Download Pearl - Alpha
          </Link>
        </Button>

        <div className="text-lg font-light text-gray-600 lg:text-xl ">
          * rewards are dependent on individual agent implementations as well as
          operator performance.
        </div>
      </div>

      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        <OperateHeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
