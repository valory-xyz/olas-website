import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';

import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import { OPERATE_AGENTS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'For Builders',
    desc: 'Contribute to Trader strategies and have a chance to earn Dev Rewards.',
    urlName: 'Reach out on Discord',
    url: 'https://discord.gg/RHY6eJ35ar',
    isExternal: true,
  },
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: '/launch',
    isExternal: false,
  },
  {
    title: 'For Operators',
    desc: 'Run Optimus agent using Quickstart.',
    urlName: 'Run Optimus agent',
    url: OPERATE_AGENTS_URL,
    isExternal: true,
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
      {list.map(({ title, desc, icon, url, urlName, isExternal }) => (
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
            <a href={url} className="text-purple-600 mt-auto" target="_blank">
              {urlName}
              <MoveUpRight className="ml-2 inline" size={16} />
            </a>
          ) : (
            <Link href={url} className="text-purple-600 mt-auto">
              {urlName}
            </Link>
          )}
        </div>
      ))}
    </div>
  </SectionWrapper>
);

const OptimusFooter = () => (
  <SectionWrapper
    customClasses="py-12 border border-purple-200 border-x-0"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid max-w-screen-xl xl:gap-0 lg:px-12 mx-auto items-center">
      <h3 className="text-center w-full italic text-purple-900 font-medium">
        Join the revolution in AI Agent-powered DeFi Management with Olas
        Optimus
      </h3>
    </div>
  </SectionWrapper>
);

export const GetInvolved = () => (
  <>
    <Content />
    <OptimusFooter />
  </>
);
