import Image from 'next/image';

import { Content } from './Content';
import { CTA } from './CTA';
import { Hero } from './Hero';
import { WhatToExpect } from './WhatToExpect';

const data = [
  {
    title: 'Cities',
    value: 5,
  },
  {
    title: 'Sponsors',
    value: 32,
  },
  {
    title: 'Speakers',
    value: 68,
  },
  {
    title: 'Attendees',
    value: '1500+',
  },
];

const Numbers = () => (
  <div className="mt-20 w-full items-end border-y-1.5">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:mx-24 lg:mx-48">
      {data.map((item, index) => {
        let borderClassName = '';
        if (index == data.length - 1) borderClassName += 'border-r-1.5';
        if (index == 1) borderClassName += 'border-r-1.5';

        return (
          <div
            key={item.title}
            className={`text-start py-6 2xl:py-3 px-8 border-gray-300 border-l-1.5 ${borderClassName}`}
          >
            <span className="block text-5xl max-sm:text-4xl font-extrabold mb-4">
              <div>{item.value} </div>
            </span>
            <span className="block text-base text-slate-700">{item.title}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export const AU = () => (
  <>
    <Hero />
    <Numbers />
    <Content />
    <WhatToExpect />
    <Image
      src="/images/au-page/au-images.png"
      alt="Agents Unleashed"
      width={1500}
      height={400}
      className="w-full"
    />
    <CTA />
  </>
);