import * as Tooltip from '@radix-ui/react-tooltip';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import trustedBy from 'data/trustedBy.json';
import Image from 'next/image';
import { TrustedByItem } from './TrustedByItem';

const trustedBySortedByOrder = [...trustedBy].sort((a, b) => a.order - b.order);
const trustedByLength = trustedBySortedByOrder.length;
const hoverZIndex = (trustedByLength + 1) * 10;

const QuoteIcon = ({ quote }) => {
  const xPlacement = quote.order * 20;
  const zPlacement = (trustedByLength - quote.order) * 10;

  const [isHovered, setIsHovered] = useState(false);
  const zIndex = isHovered ? hoverZIndex : zPlacement;

  return (
    <div>
      <Tooltip.Provider>
        <Tooltip.Root open={isHovered}>
          <Tooltip.Trigger asChild>
            <div
              className={
                'block rounded-full p-1 absolute bg-white border border-[rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out hover:-translate-y-1 group-hover:blur-[1px] [&:hover]:!blur-0'
              }
              style={{
                zIndex,
                translate: xPlacement,
              }}
              onMouseOver={() => setIsHovered(true)}
              onMouseOut={() => setIsHovered(false)}
            >
              <Image
                src={`/images/homepage/${quote.icon}`}
                alt={quote.name}
                width={20}
                height={20}
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            align="center"
            sideOffset={8}
            className="relative"
            style={{
              zIndex: hoverZIndex,
            }}
          >
            <TrustedByItem
              quote={quote}
              className="bg-white p-4 rounded-xl shadow-2xl max-w-[360px] text-left"
            />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};

TrustedByItem.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
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
      <h1 className="tracking-tight text-5xl md:text-6xl mb-12 text-black font-extrabold lg:mb-4">
        Co-own AI
      </h1>
      <div className="mb-10 text-xl leading-8 text-gray-900">
        Olas enables everyone to own and monetize their AI agents.
      </div>
      <div className="px-4 py-3 flex flex-row place-items-center gap-2 rounded-full bg-opacity-80 cursor-pointer border border-white mb-8 bg-white w-fit mx-auto transition duration-300">
        <div className="text-gray-500">
          Trusted by leading web3 teams and users
        </div>
        <ChevronRight size={16} className="text-gray-500" />
        <div className="relative w-[90px] h-[30px] group hidden sm:block">
          {trustedBySortedByOrder.map((quote) => (
            <QuoteIcon quote={quote} key={quote.name} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap place-content-center mx-4 gap-4 w-fit mx-auto">
        <Button
          variant="default"
          size="lg"
          asChild
          className="inline-flex md:ml-auto max-sm:grow"
        >
          <Link href="/pearl">Own Your Agent</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
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
