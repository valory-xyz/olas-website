import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import trustedBy from 'data/trustedBy.json';
import Image from 'next/image';

const trustedBySortedByOrder = trustedBy.sort((a, b) => a.order - b.order);
const trustedByLength = trustedBySortedByOrder.length;

const TrustedByItem = ({ order, icon, name }) => {
  const xplacement = order * 20;
  const zplacement = (trustedByLength - order) * 10;

  const [isHovered, setIsHovered] = useState(false);
  const zIndex = isHovered ? 50 : zplacement;

  return (
    <div
      className={
        'rounded-full p-1 absolute bg-white border border-[rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out hover:-translate-y-1 group-hover:blur-[1px] [&:hover]:!blur-0'
      }
      style={{
        zIndex,
        translate: xplacement,
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Image
        src={`/images/homepage/${icon}`}
        alt={name}
        width={20}
        height={20}
      />
    </div>
  );
};

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
      <source src="/videos/homepage/hero-bg.webm" type="video/webm" />
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
      <div className="px-4 py-3 flex flex-row place-items-center gap-2 rounded-full bg-opacity-80 cursor-pointer border border-white mb-8 bg-white w-fit mx-auto transition duration-300">
        <div className="text-gray-500">
          Trusted by leading web3 teams and users
        </div>
        <ChevronRight size={16} />
        <div className="relative w-[90px] h-[30px] group">
          {trustedBySortedByOrder.map((item) => (
            <TrustedByItem
              order={item.order}
              icon={item.icon}
              name={item.name}
              key={item.name}
            />
          ))}
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
