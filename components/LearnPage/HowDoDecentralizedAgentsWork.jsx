import Image from 'next/image';

import {
  SCREEN_WIDTH_LG,
  SCREEN_WIDTH_XL,
  SUB_HEADER_MEDIUM_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const DATA = [
  'Services are made up of open-source software agents',
  'Each agent instance is operated independently',
  'Services run continuously, and are fault tolerant up to a threshold',
  'Services get data from any data source',
  'They can do complex stuff, even machine learning',
  'Service agents robustly come to consensus about what action to take',
  'Services take action on any chain or call APIs',
];

export const HowDoDecentralizedAgentsWork = () => (
  <SectionWrapper customClasses="lg:p-24 px-4 !py-0">
    <div className={`${SCREEN_WIDTH_LG}`}>
      <div className={`${SUB_HEADER_MEDIUM_CLASS} mb-8`}>
        How do decentralized agents work?
      </div>
    </div>

    <div className={`${SCREEN_WIDTH_XL}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex-1">
          <div className="img-container">
            <Image
              src="/images/learn/how-do-decentralized-agents-work.svg"
              alt="How do decentralized agents work?"
              width={540}
              height={340}
            />
          </div>
        </div>

        <div className="flex-1">
          {DATA.map((item, index) => (
            <div className="my-4 flex" key={`how-olas-${index}`}>
              <div className="sr-no w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                {index + 1}
              </div>
              <div className="text my-auto">{item}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);
