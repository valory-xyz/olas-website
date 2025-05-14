import Image from 'next/image';
import Link from 'next/link';

import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const OperateHeroImage = () => (
  <Image
    src="/images/operate-page/hero.png"
    alt="Dashboard for managing AI agents in crypto, Operate decentralized AI agents with Olas"
    width={513}
    height={480}
    className="mx-auto xl:w-full"
  />
);

const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="flex justify-between max-w-[1096px] items-start mx-auto xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 lg:items-center">
      <div className="h-full max-lg:my-auto px-0 lg:mb-12 lg:col-span-5 lg:px-5 lg:text-left">
        <div className="md:hidden mb-8">
          <OperateHeroImage />
        </div>

        <h1
          className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left max-sm:text-base`}
        >
          OLAS OPERATE
        </h1>

        <h2 className={`${MAIN_TITLE_CLASS} lg:whitespace-nowrap mb-2`}>
          Run AI Agents,
          <br /> Earn Rewards
        </h2>

        <Button
          variant="default"
          size="xl"
          asChild
          className="mb-6 w-full md:w-auto"
        >
          <Link href="/pearl#download">Explore Operator Role</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 lg:col-span-6 lg:flex md:block">
        <OperateHeroImage />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
