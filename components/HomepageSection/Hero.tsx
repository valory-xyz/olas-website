import { ChevronRight, SquareArrowOutUpRight } from 'lucide-react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Tag } from 'components/ui/tag';
import featuredIn from 'data/featuredIn.json';
import Image from 'next/image';
import Link from 'next/link';

const outlets = [...featuredIn, ...featuredIn];

const AsSeenIn = () => (
  <div className="w-full">
    <div className="flex justify-center w-full">
      <Tag variant="primary" className="mb-12">
        As seen in
      </Tag>
    </div>
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />
      <div className="group flex animate-scroll w-max hover:[animation-play-state:paused]">
        {outlets.map((item, i) => (
          <a
            key={`${item.id}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-8"
          >
            <Image
              src={`/images/featured-in/${item.iconFilename}`}
              alt={item.name}
              width={180}
              height={32}
              className="transition-all duration-300 hover:brightness-0"
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
      h-[calc(100vh-250px)]
      max-h-[520px]
      flex
      flex-col
      place-items-center"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full object-cover w-full pointer-events-none"
      >
        <source src="/videos/homepage/hero-bg.webm" type="video/webm" />
      </video>
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="transparent-gradient h-[2000px] w-[5000px] -bottom-[210px] -right-[1400px] absolute" />
      </div>

      <div className="absolute right-8 top-1/3 -translate-y-1/2 animate-float hidden lg:block">
        <Link href="/blog/uniquely-human">
          <Image
            src="/images/homepage/ai-card.png"
            alt="AI card"
            width={180}
            height={206}
            className="mb-4 shadow-md rounded-2xl transition-all duration-300 ease-in-out hover:scale-[1.01] hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]"
          />
          <div className="flex items-center gap-1 font-medium text-sm justify-center hover:text-black">
            Read the blog <ChevronRight size={16} />
          </div>
        </Link>
        <a
          href="https://www.instagram.com/ai.cant.replace/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1.5 font-medium text-sm justify-center hover:text-black"
        >
          View on Instagram <SquareArrowOutUpRight size={14} />
        </a>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 lg:hidden">
        <h1 className="tracking-tight text-5xl md:text-6xl mb-4 text-black font-extrabold">
          Co-own AI
        </h1>
        <div className="max-md:text-lg text-xl leading-8 text-gray-900 mb-6">
          Olas enables everyone to own and monetize their AI agents.
        </div>
        <div className="animate-float">
          <Link href="/blog/uniquely-human">
            <Image
              src="/images/homepage/ai-card.png"
              alt="AI card"
              width={140}
              height={160}
              className="mb-2 shadow-md rounded-2xl mx-auto transition-all duration-300 ease-in-out hover:scale-[1.01] hover:[box-shadow:0_32px_9px_0_rgba(88,92,101,0.00),0_21px_8px_0_rgba(88,92,101,0.01),0_11px_7px_0_rgba(88,92,101,0.03),0_5px_5px_0_rgba(88,92,101,0.05),0_1px_3px_0_rgba(88,92,101,0.06)]"
            />
            <div className="flex items-center gap-1 font-medium text-sm justify-center hover:text-black">
              Read the blog <ChevronRight size={16} />
            </div>
          </Link>
          <a
            href="https://www.instagram.com/ai.cant.replace/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 font-medium text-sm justify-center hover:text-black"
          >
            View on Instagram <SquareArrowOutUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 h-[500px] 2xl:h-[600px] place-content-center mx-auto text-center align-middle hidden lg:block pointer-events-none">
        <h1 className="tracking-tight text-5xl md:text-6xl mb-6 lg:mb-12 text-black font-extrabold">
          Co-own AI
        </h1>
        <div className="mb-8 lg:mb-32 text-xl leading-8 text-gray-900">
          Olas enables everyone to own and monetize their AI agents.
        </div>

        <Link href="#pearl" className="mx-auto flex flex-col items-center pointer-events-auto">
          <svg width="24" height="14" viewBox="0 0 24 14" className="animate-scroll-fade">
            <polyline
              points="2,2 12,11 22,2"
              fill="none"
              stroke="#9333ea"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            className="animate-scroll-fade [animation-delay:0.3s]"
          >
            <polyline
              points="2,2 12,11 22,2"
              fill="none"
              stroke="#9C48DB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </SectionWrapper>
    <AsSeenIn />
  </>
);

export default Hero;
