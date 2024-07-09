import Image from 'next/image';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { MAIN_TITLE_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import { CTA_LINK } from './utils';

const Hero = () => (
  <SectionWrapper customClasses="py-16" backgroundType="SUBTLE_GRADIENT">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <div
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          OLAS BUILD
        </div>

        <h2 className={MAIN_TITLE_CLASS}>
          Build agents,
          <br />
          get rewarded
        </h2>

        <div className="flex gap-6">
          <Button
            variant="default"
            size="xl"
            asChild
            className="mb-6 w-full md:w-auto"
          >
            <a href={CTA_LINK}>Get started</a>
          </Button>

          <Button
            variant="ghostPrimary"
            size="xl"
            asChild
            className="mb-6 w-full md:w-auto"
          >
            <a href="https://registry.olas.network/ethereum/components">
              Explore minted agents
            </a>
          </Button>
        </div>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          src="/images/build-page/hero.svg"
          alt="hero"
          width={834}
          height={742}
          className="mx-auto w-3/4 xl:w-full"
        />
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
