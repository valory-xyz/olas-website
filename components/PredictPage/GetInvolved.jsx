import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import { LAUNCH_URL } from 'common-util/constants';

const list = [
  {
    title: 'For Builders',
    desc: 'Build Mech tools and improve Trader strategies.',
    urlName: 'View path',
    url: 'https://build.olas.network/paths/prediction-agents-mechs-ai-tool',
    isExternal: true,
  },
  {
    title: 'For Operators',
    desc: 'Run Trader agents using Pearl or manually.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
  {
    title: 'For Launchers',
    desc: 'Launch your own agent economy.',
    urlName: 'Explore',
    url: LAUNCH_URL,
    isExternal: false,
  },
];

const Content = () => (
  <SectionWrapper id="get-involved">
    <h2
      className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-6 `}
    >
      Get Involved
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {list.map(({
        title, desc, icon, url, urlName, isExternal,
      }) => (
        <div
          key={title}
          className="lg:p-6 flex flex-col gap-2 p-4 rounded-xl border border-l-4"
        >
          <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>

          <p className={TEXT_CLASS}>{desc}</p>
          {isExternal ? (
            <a href={url} className="text-purple-600">
              {urlName}
              <MoveUpRight className="ml-2 inline" size={16} />
            </a>
          ) : (
            <Link href={url} className="text-purple-600">
              {urlName}
            </Link>
          )}
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export const PredictFooter = () => (
  <SectionWrapper
    customClasses="py-12 border border-purple-200 border-x-0"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 mx-auto items-center">
      <h3 className="text-center w-full italic text-purple-900 font-medium">
        Join the revolution in prediction markets with Olas Predict
      </h3>
    </div>
  </SectionWrapper>
);

export const GetInvolved = () => (
  <>
    <Content />
    <PredictFooter />
  </>
);
