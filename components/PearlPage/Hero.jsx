import {
  MAIN_TITLE_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
  TEXT_SMALL_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const TryPearlNow = () => (
  <Button
    variant="default"
    size="lg"
    asChild
    className="mb-6 w-full md:w-fit mx-auto"
  >
    <Link href="#download">Own Your Agent</Link>
  </Button>
);

const Hero = () => (
  <SectionWrapper
    customClasses="h-[550px] md:h-[1000px] xl:min-h-[1207px] flex justify-center text-center relative"
    backgroundType="GRAY_GRADIENT"
  >
    <div className="flex flex-col gap-6 w-[648px] md:mt-[120px] mx-auto max-md:max-w-[300px]">
      <div>
        <h1 className={`${TEXT_MEDIUM_LIGHT_CLASS} mb-2 max-sm:text-base`}>
          OLAS PEARL
        </h1>
        <h2 className={`${MAIN_TITLE_CLASS} xl:mb-0`}>
          The “AI Agent App Store”
        </h2>
      </div>
      <div className={TEXT_SMALL_CLASS}>
        A world of AI agents owned by you — in one app.
      </div>
      <TryPearlNow />
    </div>
    <Image
      src="/images/pearl-page/pearl-v1.webp"
      alt="Pearl App Preview"
      width={1312}
      height={887}
      className="absolute top-[420px] md:top-[650px] lg:top-[750px] xl:top-[850px] left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:max-w-[300px] max-md:max-w-[400px]"
    />
  </SectionWrapper>
);

export default Hero;
