import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';

const tweets = [
  {
    imgSrc: '/images/operate-page/andrew-barcenas.png',
    linkUrl: 'https://x.com/andrewjbarcenas/status/1887759187964535295',
  },
  {
    imgSrc: '/images/operate-page/y.png',
    linkUrl: 'https://x.com/limetiqimo/status/1891480740208251167',
  },
  {
    imgSrc: '/images/operate-page/Fitz.png',
    linkUrl: 'https://x.com/fitzhere9/status/1887757293246435493',
  },
  {
    imgSrc: '/images/operate-page/ChowdieBoi.png',
    linkUrl: 'https://x.com/Ryanchowder1/status/1908410018908819858',
  },
];

export const WhatOperatorsAreSaying = () => (
  <SectionWrapper
    customClasses="px-4 py-16 border-y bg-gradient-to-t from-[#E7EAF4] to-gray-50"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6`}>
      What Operators are Saying
    </h2>
    <div className="flex flex-col flex-wrap w-fit lg:h-[550px] mx-auto">
      {tweets.map((tweet, index) => (
        <ExternalLink href={tweet.linkUrl} key={index} hideArrow>
          <Image src={tweet.imgSrc} alt="Contribute" width={500} height={200} />
        </ExternalLink>
      ))}
    </div>
  </SectionWrapper>
);
