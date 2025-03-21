import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';

import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'For Builders',
    desc: 'Contribute to Mechs AI tools marketplace for agents and have a chance to earn Dev Rewards.',
    urlName: 'Coming soon',
    url: '#',
    isExternal: false,
    isDisabled: true,
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
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Run Optimus agent',
    url: '/operate',
    isExternal: false,
  },
];

export const GetInvolved = () => (
  <SectionWrapper id="get-involved" customClasses="border-b px-8 py-12 lg:p-24">
    <h2
      className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-6`}
    >
      Get Involved
    </h2>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {list.map(
        ({ title, desc, icon, url, urlName, isExternal, isDisabled }) => {
          let linkContent;

          if (isDisabled) {
            linkContent = <span>{urlName}</span>;
          } else if (isExternal) {
            linkContent = (
              <a
                href={url}
                className="text-purple-600 mt-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                {urlName}
                <MoveUpRight className="ml-2 inline" size={16} />
              </a>
            );
          } else {
            linkContent = (
              <Link href={url} className="text-purple-600 mt-auto">
                {urlName}
              </Link>
            );
          }

          return (
            <div
              key={title}
              className="lg:p-6 flex flex-col gap-2 p-4 rounded-xl border border-l-4"
            >
              <div className="flex items-center">
                {icon}
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>

              <p className={TEXT_CLASS}>{desc}</p>
              {linkContent}
            </div>
          );
        },
      )}
    </div>
  </SectionWrapper>
);
