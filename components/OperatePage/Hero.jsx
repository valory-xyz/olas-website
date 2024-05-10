import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/Button';
import { TEXT } from 'styles/globals';
import SectionHeading from '../SectionHeading';

const Hero = () => (
  <SectionWrapper
    customClasses="py-16 border-b"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <div className="mb-6 text-xl tracking-widest uppercase text-slate-700">
          Olas Operate
        </div>
        <SectionHeading
          size="text-6xl sm:text-7xl lg:text-5xl xl:text-6xl lg:mb-12"
          color="text-purple-900"
        >
          Run agents, stake &
          <br />
          earn rewards*
        </SectionHeading>
        <Link href="/operate#download">
          <Button className="mb-8 hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 hover:text-white">
            <DownloadIcon className="mr-2" />
            Download Operate app
          </Button>
        </Link>

        <div className={TEXT}>
          * rewards are dependent on individual agent implementations as well as
          operator performance.
        </div>
      </div>
      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          src="/images/operate-page/operate-hero.png"
          alt="hero"
          width={638}
          height={596}
          className="mx-auto w-3/4 xl:w-full"
        />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
