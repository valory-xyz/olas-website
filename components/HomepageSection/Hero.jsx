import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import trustedBy from 'data/trustedBy.json';
import Image from 'next/image';

const Hero = () => (
  <SectionWrapper
    customClasses="
    homepage-hero-bg
    h-[calc(100vh-150px)]
    max-h-[800px]
    flex
    flex-col
    place-items-center"
  >
    <video
      autoPlay
      loop
      muted
      playsInline
      className="homepage-video-bg h-full object-fill w-full"
    >
      <source src="/video/homepage/hero-bg.webm" type="video/webm" />
    </video>
    <div className="absolute w-full h-full overflow-hidden">
      <div className="transparent-gradient h-[2000px] w-[5000px] bottom-0 -right-[1500px] absolute" />
    </div>
    <div className="absolute h-[500px] place-content-center mx-auto text-center">
      <h1 className="tracking-tight text-4xl md:text-6xl max-sm:text-6xl md:text-[4rem] mb-12 text-black  font-extrabold lg:mb-4">
        Co-own AI
      </h1>
      <div className="mb-10 text-xl leading-8 text-gray-900">
        Olas enables everyone to own and monetize their AI agents.
      </div>
      <div className="px-4 py-3 flex hover:font-medium flex-row place-items-center gap-2 rounded-full bg-opacity-80 cursor-pointer border border-white mb-8 bg-white w-fit mx-auto transition duration-300">
        <div>Trusted by leading web3 teams and users</div>
        <ChevronRight size={16} />
        <div className="relative w-[90px] h-[30px] group">
          {trustedBy.map((item) => {
            const xplacement = item.order * 20;
            const zplacement = (4 - item.order) * 10;

            return (
              <div
                key={item.name}
                className={`
                  rounded-full p-1 absolute translate-x-[${xplacement}px] z-${zplacement} 
                  bg-white border border-[rgba(0, 0, 0, 0.05)]
                  transition-all duration-300 ease-in-out
                  hover:-translate-y-1
                  hover:z-50
                  group-hover:blur-[1px]
                  [&:hover]:!blur-0
                `}
              >
                <Image
                  src={`/images/homepage/${item.icon}`}
                  alt={item.name}
                  width={20}
                  height={20}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex max-sm:flex-wrap max-sm:place-content-center max-sm:mx-4 gap-4 w-fit mx-auto">
        <Button
          variant="default"
          size="xl"
          asChild
          className="inline-flex md:ml-auto max-sm:grow"
        >
          <Link href="/pearl">Own Your Agent</Link>
        </Button>
        <Button
          variant="outline"
          size="xl"
          asChild
          className="inline-flex md:ml-auto max-sm:grow"
        >
          <Link href="#choose-your-role">Get Involved</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
