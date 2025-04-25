import { MAIN_TITLE_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { H1 } from 'components/ui/typography';
import Image from 'next/image';

const HeaderLeftContent = () => (
  <div className="lg:col-span-6 px-5 lg:p-0 lg:text-left w-auto mb-12">
    <div className={TEXT_MEDIUM_LIGHT_CLASS}>BABY DEGEN</div>
    <H1 className={`${MAIN_TITLE_CLASS} mb-6 lg:w-5s/6`}>
      Step into DeFAI: <br />
      AI agent powered trading
    </H1>
    <Button variant="default" size="xl" asChild className="grow lg:w-auto ">
      <a href="#meet-the-babydegens">Explore Babydegens</a>
    </Button>
  </div>
);

const HeaderRightContent = () => (
  <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
    <Image
      src="/images/services/babydegen/babydegen.png"
      alt="Baby Degen"
      width={400}
      height={400}
      className="mx-auto rounded-lg"
    />
  </div>
);

export const Hero = () => (
  <SectionWrapper customClasses="border-y" backgroundType="SUBTLE_GRADIENT">
    <div className="max-w-screen-xl xl:gap-0 lg:gap-8 lg:grid-cols-12 lg:px-16 grid mx-auto my-24 items-center">
      <HeaderLeftContent />
      <HeaderRightContent />
    </div>
  </SectionWrapper>
);
