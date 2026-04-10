import { ChevronRight } from 'lucide-react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';
import featuredIn from 'data/featuredIn.json';
import Image from 'next/image';
import Link from 'next/link';

const outlets = [...featuredIn, ...featuredIn];

const AsSeenIn = () => (
  <div className="w-full">
    <div className='flex w-full'>
    <Tag variant="primary" className="mb-12 w-auto mx-auto">As seen in</Tag>
    </div>
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />
      <div className="flex animate-scroll w-max">
        {outlets.map((item, i) => (
          <a
            key={`${item.id}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-10"
          > 
            <Image
              src={`/images/featured-in/${item.iconFilename}`}
              alt={item.name}
              width={130}
              height={24}
              className="h-10 w-auto object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  </div>
);

const Hero = () => (
  <>
    <SectionWrapper
      customClasses="
      relative
      overflow-hidden
      homepage-hero-bg
      h-[calc(100vh-250px)]
      max-h-[520px]
      flex
      flex-col
      place-items-center"
    >
      <video autoPlay loop muted playsInline className="h-full object-cover w-full">
        <source src="/videos/homepage/hero-bg.webm" type="video/webm" />
      </video>
      <div className="absolute w-full h-full overflow-hidden">
        <div className="transparent-gradient h-[2000px] w-[5000px] bottom-0 -right-[1500px] absolute" />
      </div>

      <Link href="/blog/uniquely-human" className="hidden lg:block">
        <div className="absolute right-8 top-1/3 -translate-y-1/2 animate-float">
          <Image
            src="/images/homepage/ai-card.png"
            alt="AI card"
            width={180}
            height={206}
            className="mb-4 shadow-md rounded-2xl"
          />
          <div className="flex items-center gap-1 font-medium text-sm justify-center">
            #UniquelyHuman <ChevronRight size={20} />
          </div>
        </div>
      </Link>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 lg:hidden">
        <h1 className="tracking-tight text-5xl md:text-6xl mb-4 text-black font-extrabold">
          Co-own AI
        </h1>
        <div className="max-md:text-lg text-xl leading-8 text-gray-900 mb-6">
          Olas enables everyone to own and monetize their AI agents.
        </div>
        <Link href="/blog/uniquely-human" className="animate-float">
          <Image
            src="/images/homepage/ai-card.png"
            alt="AI card"
            width={140}
            height={160}
            className="mb-2 shadow-md rounded-2xl mx-auto"
          />
          <div className="flex items-center gap-1 font-medium text-sm justify-center">
            #UniquelyHuman <ChevronRight size={20} />
          </div>
        </Link>
      </div>

      <div className="absolute h-[500px] 2xl:h-[600px] place-content-center mx-auto text-center align-middle hidden lg:block">
        <h1 className="tracking-tight text-5xl md:text-6xl mb-6 lg:mb-12 text-black font-extrabold">
          Co-own AI
        </h1>
        <div className="mb-8 lg:mb-32 text-xl leading-8 text-gray-900">
          Olas enables everyone to own and monetize their AI agents.
        </div>

        <Link href="#pearl">
          <Image
            src="/images/homepage/scroll-icon.svg"
            alt="scroll"
            width={32}
            height={36}
            className="mx-auto animate-bounce-intermittent duration-250"
          />
        </Link>
      </div>
    </SectionWrapper>
    <AsSeenIn />
  </>
);

export default Hero;
