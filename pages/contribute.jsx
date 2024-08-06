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
  TEXT_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const HeroImage = () => (
  <Image
    src="/images/contribute-page/hero.png"
    alt="Contribute Hero"
    width={340}
    height={350}
  />
);

const Hero = () => (
  <SectionWrapper customClasses={`border-b ${SECTION_BOX_CLASS}`}>
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-top  xl:gap-0 ">
      <div className="md:mb-12 lg:col-span-6 lg:text-left">
        <div className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left`}>
          CONTRIBUTE
        </div>
        <h2 className={`mb-6 ${MAIN_TITLE_CLASS}`}>
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
          <Link href="/contribute#what-is-olas-contribute-service">Learn how</Link>
        </Button>
      </div>

      <div className="hidden sm:block col-span-1" />

      <div className="hidden lg:mt-0 lg:col-span-5 lg:flex md:block justify-end">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);

const WhatIsOlasContributeService = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 py-12" id="what-is-olas-contribute-service">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-start">
      <div className="pr-0 lg:col-span-6 lg:pr-20 mb-12">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>What is the Olas Contribute Service?</h2>

        <div className="flex flex-col gap-5">
          <p className={TEXT_CLASS}>
            Olas Contribute is an advanced autonomous service designed to
            measure and analyze the impact of community interactions within any
            ecosystem.
          </p>
          <p className={TEXT_CLASS}>
            At its core, this service consists of four autonomous agents that
            continuously monitor and analyze X (formerly Twitter) to read and
            record the contributions of community members of a specific
            ecosystem, e.g. Olas.
          </p>
          <p className={TEXT_CLASS}>
            The agents do this by fetching posts on X that mention the ecosystem
            or use an ecosystem-specific hashtag. The individual posts are then
            analyzed for their relevance and quality and are then scored to
            quantify the impact.
          </p>
        </div>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          className="mx-auto rounded-lg shadow-sm border"
          alt="OLAS Utility"
          src="/images/contribute-page/leaderboard.png"
          width={615}
          height={405}
        />
      </div>
    </div>
  </SectionWrapper>
);

const HowItWorks = () => null;

const GetStarted = () => null;

const ContributePage = () => (
  <PageWrapper>
    <Meta pageTitle="Olas Contribute" />
    <Hero />
    <WhatIsOlasContributeService />
    <HowItWorks />
    <GetStarted />
  </PageWrapper>
);

export default ContributePage;
