import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  MAIN_TITLE_CLASS,
  TEXT_SMALL_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const HeroImage = () => (
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
      <div className="px-0 md:mb-12 lg:col-span-5 lg:px-5 lg:text-left">
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left`}>
          CONTRIBUTE
        </div>

        <h2 className={MAIN_TITLE_CLASS}>
          Track community impact, transform your network
        </h2>

        <div className="md:hidden mb-8">
          <HeroImage />
        </div>

        <div className={TEXT_SMALL_CLASS}>
          Leverage autonomous services to track and enhance the influence of
          your community.
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="mt-6 w-full md:w-auto"
        >
          <Link href="/operate#download">Learn how</Link>
        </Button>
      </div>
      <div className="hidden sm:block col-span-1" />
      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

const ContributePage = () => (
  <PageWrapper>
    <Meta pageTitle="Olas Contribute" />
    <Hero />
  </PageWrapper>
);

export default ContributePage;
