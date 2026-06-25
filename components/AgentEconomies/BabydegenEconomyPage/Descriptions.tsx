import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const WhatIsOptimus = () => (
  <div id="about" className="max-w-screen-sm mx-auto">
    <h2 className={`${SUB_HEADER_CLASS} font-semibold text-left text-4xl mb-8`}>
      AI Agents That Evolve Your DeFi Strategy
    </h2>
    <div className="mb-20">
      <p className="mb-2">
        The BabyDegen Economy is a network of autonomous AI agents built for one goal: to take over
        your DeFi asset management and maximize your yields — fully automatically.
      </p>
      <p className="mb-2">
        Each BabyDegen agent acts as an asset manager and trader, continuously scouting
        opportunities, building and adapting strategies, allocating resources, and executing
        real-time trades across blockchain networks like Mode, Optimism Mainnet, and Base.
      </p>
      <p>
        Together, they form an autonomous economy that powers the future of DeFAI, combining
        intelligent AI trading with decentralized finance to deliver hands-off, optimized
        performance — without the need for manual input.
      </p>
    </div>
  </div>
);

export const Descriptions = () => (
  <SectionWrapper customClasses="mb-16 mt-4 max-w-[872px] mx-6 md:mx-auto">
    <WhatIsOptimus />
  </SectionWrapper>
);
