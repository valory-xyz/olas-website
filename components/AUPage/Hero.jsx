import { OPERATE_AGENTS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import Image from 'next/image';

export const Hero = () => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses="border-y bg-[url('/images/au-page/hero-bg.png')] bg-cover bg-center bg-no-repeat h-full"
  >
    <div className="max-w-screen-xl max-lg:mx-8 max-lg:my-12 flex flex-row justify-between mx-auto">
      <div className="flex flex-col gap-8 lg:p-0 lg:text-left my-auto lg:ml-16 max-md:mx-auto max-md:my-auto">
        <Image
          src="/images/au-page/agents-unleashed.png"
          alt="Agents Unleashed"
          width={400}
          height={120}
        />

        <p className={`text-black max-w-[380px]`}>
          The premier AI Agent event series, showcasing the cutting-edge of this
          crypto and AI.
        </p>

        <Button variant="default" size="xl" asChild className="grow lg:w-auto ">
          <a href={OPERATE_AGENTS_URL}>Don&apos;t miss out</a>
        </Button>
      </div>

      <div className="max-lg:hidden overflow-hidden">
        <Image
          src="/images/au-page/hero-images.png"
          alt="Agents Unleashed"
          width={600}
          height={900}
          className="rounded-lg mr-12 object-contain"
        />
      </div>
    </div>
  </SectionWrapper>
);