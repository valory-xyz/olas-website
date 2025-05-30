import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';

const tweets = [
  {
    imgSrc: '/images/contribute-page/ChrisOLAS.png',
    linkUrl: 'https://x.com/chrissee10/status/1863536913065603454',
  },
  {
    imgSrc: '/images/contribute-page/Fitz.png',
    linkUrl: 'https://x.com/fitzhere9/status/1862003514094096649',
  },
  {
    imgSrc: '/images/contribute-page/ChowdieBoi.png',
    linkUrl: 'https://x.com/Ryanchowder1/status/1863810827872260502',
  },
  {
    imgSrc: '/images/contribute-page/Eolas.png',
    linkUrl: 'https://x.com/Eolas_AI/status/1862814060338667852',
  },
];

export const WhatContributorsAreSaying = () => (
  <SectionWrapper
    id="social-proof"
    customClasses="px-4 py-16 border-y bg-gradient-to-t from-[#E7EAF4] to-gray-50"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6`}>
      What Contributors are saying
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
