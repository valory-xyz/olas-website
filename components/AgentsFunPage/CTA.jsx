import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';

import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import { LAUNCH_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: LAUNCH_URL,
    isExternal: false,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

export const CTA = () => (
  <SectionWrapper
    customClasses="border-b-1.5 p-4 md:px-8 py-16 md:pb-32"
    id="get-involved"
  >
    <div className="max-w-4xl mx-auto">
      <h2 className={`${SUB_HEADER_CLASS} text-center lg:mb-14 mb-6 `}>
        Get Involved
      </h2>

      <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
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
    </div>
  </SectionWrapper>
);
