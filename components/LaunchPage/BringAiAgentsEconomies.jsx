import Link from 'next/link';
import Image from 'next/image';

import {
  SUB_HEADER_CLASS,
  TEXT_CLASS,
  SECTION_BOX_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const DESC = "Create and deploy entire AI agent economies within your ecosystem effortlessly. As an Olas Launcher, you'll have the tools and resources to bring autonomous agents into your ecosystem, driving growth in transaction volume and other key metrics.";

export const BringAiAgentsEconomies = () => (
  <SectionWrapper customClasses={SECTION_BOX_CLASS}>
    <div className="grid max-w-screen-xl mx-auto lg:px-12 lg:grid-cols-12">
      <h2
        className={`${SUB_HEADER_CLASS} mb-4 md:col-span-6 lg:mb-0 lg:col-span-5 lg:pr-6`}
      >
        Bring AI agents economies to your ecosystem
      </h2>
      <div className="hidden lg:block col-span-1" />
      <p className={`${TEXT_CLASS} md:col-span-6 lg:pl-14`}>{DESC}</p>
    </div>

    <div className="mb-2 mt-6 lg:mt-14 lg:mb-6">
      <Image
        src="/images/launch-page/predict.png"
        alt="predict"
        width={1180}
        height={348}
        className="mx-auto"
      />
    </div>

    <div className="text-center text-slate-500">
      <Link
        href="https://olas.network/agent-economies/predict"
        className="text-purple-600"
      >
        Olas Predict
      </Link>
      {' '}
      is a bright example of the autonomous AI agent economy.
    </div>
  </SectionWrapper>
);
