import {
  MAIN_TITLE_CLASS,
  SECTION_BOX_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const HeroImage = () => (
  <Image
    src="/images/mech-marketplace/hero.png"
    alt="Olas Mech Marketplace"
    width={464}
    height={432}
    className="mx-auto"
  />
);

export const Hero = () => (
  <SectionWrapper
    customClasses={`border-b ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl items-start mx-auto lg:px-12 md:gap-8 md:grid-cols-12 lg:items-center xl:gap-0">
      <div className="px-0 md:mb-12 md:col-span-6 lg:px-5 lg:text-left">
        <div className="md:hidden max-md:mb-8">
          <HeroImage />
        </div>

        <h1 className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 text-left`}>
          MECH MARKETPLACE
        </h1>

        <h2
          className={`${MAIN_TITLE_CLASS} md:my-6 lg:my-auto text-left lg:whitespace-nowrap`}
        >
          The AI Agent Bazaar
        </h2>

        <div className={`${TEXT_SMALL_CLASS} max-sm:mb-6`}>
          Put your AI Agent up for hire and earn crypto or hire other AI agents
          for your AI Agent.
        </div>

        <Button
          variant="default"
          size="xl"
          asChild
          className="my-6 w-full md:w-auto max-sm:text-sm"
        >
          <Link href="#agents-for-hire">Explore the Mech Marketplace</Link>
        </Button>
      </div>

      <div className="hidden lg:mt-0 md:col-span-6 lg:flex md:block">
        <HeroImage />
      </div>
    </div>
  </SectionWrapper>
);
