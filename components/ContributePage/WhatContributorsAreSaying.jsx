import { TestimonySection } from 'components/TestimonySection';

const tweets = [
  {
    imgSrc: 'ChrisOLAS.png',
    linkUrl: 'https://x.com/chrissee10/status/1863536913065603454',
  },
  {
    imgSrc: 'Fitz.png',
    linkUrl: 'https://x.com/fitzhere9/status/1862003514094096649',
  },
  {
    imgSrc: 'ChowdieBoi.png',
    linkUrl: 'https://x.com/Ryanchowder1/status/1863810827872260502',
  },
  {
    imgSrc: 'Eolas.png',
    linkUrl: 'https://x.com/Eolas_AI/status/1862814060338667852',
  },
];

export const WhatContributorsAreSaying = () => (
  <TestimonySection
    folderName="contribute-page"
    title="What Contributors are saying"
    list={tweets}
  />
);
