import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  'Expert panels, firesides, and exclusive alpha announcements from the leading builders in the space.',
  'Networking with those same experts, investors, builders and enthusiasts.',
  'Impressive venues, tasty local and international food and sometimes, if you&apos;re lucky, humans unleashed: the afterparty.',
];

export const WhatToExpect = () => (
  <SectionWrapper customClasses="max-sm:mx-0 mx-8 xl:mx-[300px] mb-24">
    <h2 className={`${SUB_HEADER_CLASS} mb-12 text-center`}>What to expect</h2>

    <div className="grid grid-cols-1 gap-6">
      {list.map((item, index) => (
        <div
          key={index}
          className="flex gap-2 rounded-xl border-1.5 border-purple-200 lg:gap-4"
        >
          <div className="border-r-1.5 border-purple-200 w-[80px] h-[80px] max-sm:min-h-[120px] max-sm:min-w-[80px] aspect-square flex justify-center text-center bg-gradient-to-t from-[#FAF0FF]">
            <span className="text-[56px] font-bold text-purple-400">
              {index + 1}
            </span>
          </div>
          <div className="my-auto mr-4">
            <p className="text-base">{item}</p>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);
