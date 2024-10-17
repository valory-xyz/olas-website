import Image from 'next/image';

import { MAIN_TITLE_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const LeftContent = () => (
  <div className="lg:col-span-5 lg:col-start-2 lg:p-0 lg:text-left lg:gap-0 lg:items-start md:mb-12 flex-col flex text-center item-center px-5 mb-2 gap-6">
    <div
      className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
    >
      OLAS OPTIMUS
    </div>

    <h2 className={MAIN_TITLE_CLASS}>
      AI Agent-powered
      <br />
      DeFi Management
    </h2>
  </div>
);

const RightContent = () => (
  <div className="lg:mt-0 lg:col-span-6 lg:flex">
    <Image
      src="/images/optimus-page/hero.png"
      alt="Optimus Hero"
      width={834}
      height={742}
      className="xl:w-full mx-auto w-3/4"
    />
  </div>
);

export const OptimusHero = () => (
  <SectionWrapper customClasses="py-16" backgroundType="SUBTLE_GRADIENT">
    <div className="max-w-screen-xl xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 grid mx-auto items-center">
      <LeftContent />
      <RightContent />
    </div>
  </SectionWrapper>
);
