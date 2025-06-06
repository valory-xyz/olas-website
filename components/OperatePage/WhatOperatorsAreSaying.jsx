import { TestimonySection } from 'components/TestimonySection';

const tweets = [
  {
    imgSrc: 'andrew-barcenas.png',
    linkUrl: 'https://x.com/andrewjbarcenas/status/1887759187964535295',
  },
  {
    imgSrc: 'y.png',
    linkUrl: 'https://x.com/limetiqimo/status/1891480740208251167',
  },
  {
    imgSrc: 'Fitz.png',
    linkUrl: 'https://x.com/fitzhere9/status/1887757293246435493',
  },
  {
    imgSrc: 'ChowdieBoi.png',
    linkUrl: 'https://x.com/Ryanchowder1/status/1908410018908819858',
  },
];

export const WhatOperatorsAreSaying = () => (
  <TestimonySection
    id="social-proof"
    folderName="operate-page"
    title="What Operators are saying"
    list={tweets}
  />
);
