import Image from 'next/image';
import Link from 'next/link';

import { MAIN_TITLE_CLASS, TEXT_LIGHT_CLASS } from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

const CTA_LINK = 'https://launch.olas.network/';

const Hero = () => (
  <SectionWrapper customClasses="py-16" backgroundType="SUBTLE_GRADIENT">
    <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
        <div className={`${TEXT_LIGHT_CLASS} mb-2 text-left`}>OLAS LAUNCH</div>

        <h2 className={MAIN_TITLE_CLASS}>
          Get agents running in your ecosystem
        </h2>

        <Button
          variant="default"
          size="xl"
          asChild
          className="mb-6 w-full md:w-auto"
        >
          <Link href={CTA_LINK} target="_blank">
            Get started
          </Link>
        </Button>
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
