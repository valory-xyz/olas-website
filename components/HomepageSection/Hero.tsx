import * as Tooltip from '@radix-ui/react-tooltip';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { TrusteeQuotePropTypes } from 'common-util/propTypes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import unsortedTrustedBy from 'data/trustedBy.json';
import Image from 'next/image';
import { Trustee } from './Trustee';

const trustedBy = [...unsortedTrustedBy].sort((a, b) => a.order - b.order);
const trustedByLength = trustedBy.length;
const hoverZIndex = (trustedByLength + 1) * 10;

const QuoteIcon = ({ quote }) => {
  const xPlacement = quote.order * 20;
  const zPlacement = (trustedByLength - quote.order) * 10;

  const [isHovered, setIsHovered] = useState(false);
  const zIndex = isHovered ? hoverZIndex : zPlacement;

  return (
    <div>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0} open={isHovered} onOpenChange={setIsHovered}>
          <Tooltip.Trigger
            className={
              'block rounded-full p-1 absolute bg-white border border-[rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out hover:-translate-y-1 group-hover:blur-[1px] [&:hover]:!blur-0'
            }
            style={{
              zIndex,
              translate: xPlacement,
            }}
          >
            <Image src={`/images/homepage/${quote.icon}`} alt={quote.name} width={20} height={20} />
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            align="center"
            className="relative"
            style={{
              zIndex: hoverZIndex,
            }}
          >
            <Trustee
              quote={quote}
              className="bg-white p-4 rounded-xl shadow-2xl max-w-[360px] text-left ml-2"
            />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};

QuoteIcon.propTypes = {
  quote: TrusteeQuotePropTypes,
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
    <video autoPlay loop muted playsInline className="homepage-video-bg h-full object-fill w-full">
      <source src="/videos/homepage/hero-bg.webm" type="video/webm" />
    </video>
    <div className="absolute w-full h-full overflow-hidden">
      <div className="transparent-gradient h-[2000px] w-[5000px] bottom-0 -right-[1500px] absolute" />
    </div>
    <div className="absolute h-[500px] 2xl:h-[800px] place-content-center mx-auto text-center align-middle">
      <h1 className="tracking-tight text-5xl md:text-6xl mb-12 text-black font-extrabold lg:mb-4">
        Co-own AI
      </h1>
      <div className="mb-10 text-xl leading-8 text-gray-900">
        Olas enables everyone to own and monetize their AI agents.
      </div>
      <div className="px-4 py-3 flex flex-row place-items-center gap-2 rounded-full bg-opacity-80 cursor-pointer border border-white mb-8 bg-white w-fit mx-auto transition duration-300">
        <Link href="#social-proof" className="inline-flex items-center gap-2">
          <div className="text-gray-500">Trusted by leading web3 teams and users</div>
          <ChevronRight size={16} className="text-gray-500" />
        </Link>
        <div className="relative w-[90px] h-[30px] group hidden sm:block">
          {trustedBy.map((quote) => (
            <QuoteIcon quote={quote} key={quote.name} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap place-content-center mx-4 gap-4 w-fit mx-auto">
        <Button variant="default" size="lg" asChild className="inline-flex md:ml-auto max-sm:grow">
          <Link href="/#pearl">Own Your Agent</Link>
        </Button>
        <Button variant="outline" size="lg" asChild className="inline-flex md:ml-auto max-sm:grow">
          <Link href="/olas-token#choose-your-role">Get Involved</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);

export default Hero;
