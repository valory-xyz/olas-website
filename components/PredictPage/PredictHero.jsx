import Image from 'next/image';

import { MAIN_TITLE_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

const LeftContent = () => (
  <div className="lg:col-span-5 lg:col-start-2 lg:p-0 lg:text-left lg:gap-0 md:mb-12 flex-col flex lg:items-start text-center item-center px-5 mb-2 gap-6">
    <div
      className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
    >
      OLAS PREDICT
    </div>

    <h2 className={MAIN_TITLE_CLASS}>
      On-demand
      <br />
      Agent-powered
      <br />
      Predictions
    </h2>

    <Button
      variant="default"
      size="xl"
      asChild
      className="mb-6 w-full md:w-auto"
    >
      <a href="#get-involved">Get Involved</a>
    </Button>
  </div>
);

const RightContent = () => (
  <div className="lg:mt-0 lg:col-span-6 lg:flex">
    <Image
      src="/images/predict-page/hero.png"
      alt="hero"
      width={834}
      height={742}
      className="mx-auto w-3/4 xl:w-full"
    />
  </div>
);

export const PredictHero = () => (
  <SectionWrapper customClasses="py-16" backgroundType="SUBTLE_GRADIENT">
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 mx-auto items-center">
      <LeftContent />
      <RightContent />
    </div>
  </SectionWrapper>
);