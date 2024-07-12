import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import SectionWrapper from 'components/Layout/SectionWrapper';
import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';

const list = [
  {
    title: 'For builders',
    desc: 'Build Mech tools and improve Trader strategies.',
    urlName: 'View path',
    url: 'https://build.olas.network/paths/prediction-agents-mechs-ai-tool',
    isExternal: true,
  },
  {
    title: 'For operators',
    desc: 'Run Trader agents using Pearl or manually.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

const Content = () => (
  <div className="max-w-screen-lg lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
    <h2
      className={`${SUB_HEADER_CLASS} text-left mb-8 lg:text-center lg:mb-14`}
    >
      Get Involved
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {list.map(({
        title, desc, icon, url, urlName, isExternal,
      }) => (
        <div
          key={title}
          className="flex flex-col gap-2 p-4 rounded-xl border border-l-4 lg:p-6"
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
              <MoveUpRight className="ml-2 inline" size={16} />
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const PredictFooter = () => (
  <SectionWrapper
    customClasses="py-12 border border-purple-200"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 mx-auto items-center">
      <h3 className="text-center w-full italic text-purple-900">
        Join the revolution in prediction markets with Olas Predict
      </h3>
    </div>
  </SectionWrapper>
);

export const GetInvolved = () => (
  <>
    <SectionWrapper
      customClasses={`${SECTION_BOX_CLASS} border`}
      id="get-involved"
    >
      <Content />
    </SectionWrapper>
    <PredictFooter />
  </>
);
