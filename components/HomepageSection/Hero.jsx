import Image from 'next/image';
import React from 'react';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';
import HeroImage from './HeroImage';
import { BUTTON } from '@/styles/globals';

const Hero = () => (
  <SectionWrapper customClasses="py-16 border-b" backgroundType="bg-white">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <SectionHeading size="text-6xl sm:text-7xl lg:text-5xl xl:text-7xl lg:mb-6 font-extrabold" color="text-purple-900">
          Crypto&apos;s ocean
          <br />
          of services
        </SectionHeading>
        <p className="mb-6 text-xl font-light text-gray-600">
          One single network for all the stuff that makes crypto work.
          Coordinated by the OLAS token and built on cutting edge, autonomous
          agent technology.
        </p>
        <a
          href="#get-involved"
          className={`inline-flex ${BUTTON}`}
        >
          Get involved
        </a>
      </div>
      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
