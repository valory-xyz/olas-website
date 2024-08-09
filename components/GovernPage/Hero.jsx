import Image from 'next/image';
import Link from 'next/link';

import {
  MAIN_TITLE_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import { Button } from 'components/ui/button';
import SectionWrapper from 'components/Layout/SectionWrapper';

export const Hero = () => (
  <SectionWrapper
    customClasses="py-16 border-b"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 lg:gap-8 lg:grid-cols-12 mx-auto items-center">
      <div className="lg:col-span-6 lg:p-0 lg:text-left lg:gap-0 md:mb-12 flex-col flex lg:items-start text-center px-5 mb-2 gap-6 lg:max-w-[524px]">
        <div
          className={`${TEXT_MEDIUM_LIGHT_CLASS} lg:self-start mb-2 self-center`}
        >
          OLAS GOVERN
        </div>

        <h2 className={MAIN_TITLE_CLASS}>Direct the future of Olas</h2>

        <p className={TEXT_SMALL_CLASS}>
          Join the decision-making process that drives growth in the Olas
          ecosystem.
        </p>

        <Button variant="default" size="xl" asChild className="lg:mt-6 w-max self-center lg:self-start">
          <Link href="https://govern.olas.network">Start governing now</Link>
        </Button>
      </div>

      <div className="lg:mt-0 lg:col-span-6 lg:flex">
        <Image
          src="/images/govern-page/hero.svg"
          alt="hero"
          width={464}
          height={432}
          className="mx-auto w-3/4 xl:w-full"
        />
      </div>
    </div>
  </SectionWrapper>
);
