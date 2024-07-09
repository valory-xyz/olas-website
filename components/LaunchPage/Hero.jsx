import Image from 'next/image';
import Link from 'next/link';

import { MAIN_TITLE_CLASS, TEXT_MEDIUM_LIGHT_CLASS } from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

const Hero = () => (
  <SectionWrapper customClasses="py-16" backgroundType="SUBTLE_GRADIENT">
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 mx-auto items-center">
      <div className="lg:col-span-6 lg:p-0 lg:text-left lg:gap-0 md:mb-12 flex-col flex items-start text-center px-5 mb-2 gap-6">
        <div
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          OLAS LAUNCH
        </div>

        <h2 className={MAIN_TITLE_CLASS}>
          Get agents running in your ecosystem
        </h2>

        <div className="flex gap-6">
          <Button
            variant="default"
            size="xl"
            asChild
            className="mb-6 w-full md:w-auto"
          >
            <Link href="https://launch.olas.network/">Get started</Link>
          </Button>

          <Button
            variant="ghostPrimary"
            size="xl"
            asChild
            className="mb-6 w-full md:w-auto"
          >
            <Link href="https://registry.olas.network/ethereum/services">
              Explore launched services
            </Link>
          </Button>
        </div>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          src="/images/launch-page/hero.svg"
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
