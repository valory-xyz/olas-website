import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';
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
          <Link href="/contribute#what-is-olas-contribute-service">
            Learn how
          </Link>
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
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12"
    id="what-is-olas-contribute-service"
  >
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-start">
      <div className="pr-0 lg:col-span-6 lg:pr-20 mb-12">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>
          What is the Olas Contribute Service?
        </h2>

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
          alt="OLAS Utility"
          src="/images/contribute-page/leaderboard.png"
          width={615}
          height={405}
        />
      </div>
    </div>
  </SectionWrapper>
);

const howItWorksList = [
  [
    'Community members or users start by connecting their wallets and X account on the web app. ',
  ],
  [
    'Upon completion, members are requested to publish an initial post on X that the agents recognize and begin tracking their contributions.',
  ],
  [
    'As members continue to post, they accumulate points based on their tweets quality and relevance, which then influences their position on the community leaderboard.',
  ],
  [
    'All community members can see their and other members’ contributions reflected on the leaderboard. As the members grow their points, they can mint their NFT badges that showcases their level of contributions. ',
    'As they climb up the ladder, this NFT badge evolves. This not only gamifies the experience but also visually represents their growing influence within the community.',
  ],
  [
    'Besides tracking posts on X, another feature of Contribute is the option to propose posts. Members with a certain amount of tokens can suggest new posts to be published on X, which are then subject to voting.',
    'Approved posts are subsequently published, further engaging the community and promoting active participation.',
  ],
];
const HowItWorks = () => (
  <SectionWrapper
    customClasses="lg:px-24 lg:py-0 px-4 py-12"
    id="what-is-olas-contribute-service"
  >
    <div className="grid max-w-screen-md items-start m-auto">
      <div className="pr-0 lg:col-span-6 lg:pr-12 mb-12">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6 text-center`}>
          How it works
        </h2>
        <div className="flex flex-col items-center gap-6">
          {howItWorksList.map((list, index) => (
            <div
              key={index}
              className="flex w-full rounded-lg border border-purple-200"
            >
              <p
                className="flex items-center text-5xl font-bold text-purple-500 p-4 border-x border-l-0 border-purple-200 rounded-l-lg"
                style={{
                  background: 'linear-gradient(180deg, #FFF 0%, #FAF0FF 100%)',
                  // color: 'white',
                  /* eslint-disable-next-line max-len */
                  // textShadow: '-1px -1px 0 #a855f7, 1px -1px 0 #a855f7, -1px 1px 0 #a855f7, 1px 1px 0 #a855f7',
                }}
              >
                {index + 1}
              </p>
              <div className="flex flex-col gap-2 p-4 ">
                {list.map((text, kIndex) => (
                  <p key={kIndex} className={TEXT_CLASS}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const GetStarted = () => (
  <SectionWrapper
    customClasses="lg:p-24 px-4 py-12 border-y border-t-0"
    id="what-is-olas-contribute-service"
  >
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-start">
      <div className="pr-0 lg:col-span-6 lg:pr-12 mb-12">
        <h2 className={`${SUB_HEADER_CLASS} mb-4 lg:mb-6`}>Get started</h2>

        <div className="flex flex-col gap-5">
          <p className={TEXT_CLASS}>
            You can use this powerful autonomous service to track and enhance
            the contributions of your community members in your own ecosystem.
            By leveraging the Coordination Kit, you can deploy a similar system
            to measure impact of community contributions in your ecosystem.
          </p>
          <p className={TEXT_CLASS}>
            The Coordination Kit includes all the necessary code you need to set
            up this autonomous service within your ecosystem.
          </p>
          <p className={TEXT_CLASS}>
            Simply fork the existing code, adjust it to align with your
            parameters, and integrate it.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center lg:col-span-6">
        <div className="relative h-[294px] w-[316px] ">
          <Image
            alt="OLAS Utility"
            src="/images/contribute-page/cta-background.png"
            width={316}
            height={294}
          />
          <Button
            variant="default"
            size="lg"
            className="absolute w-[200px] top-[132px] left-1/2 -translate-x-1/2"
            onClick={() => window.open(
              'https://docs.autonolas.network/product/coordinationkit/',
              '_blank',
            )}
          >
            Get the CoordinationKit
          </Button>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

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
