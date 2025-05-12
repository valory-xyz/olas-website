import Link from 'next/link';

import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';

const list = [
  {
    title: 'For Launchers',
    desc: 'Bring your own AI agent economy to your ecosystem.',
    urlName: 'Learn more',
    url: 'https://build.olas.network/paths/prediction-agents-mechs-ai-tool',
    isExternal: true,
  },
  {
    title: 'For Operators',
    desc: 'Run agents using Pearl or manually, stake & have a chance to earn rewards.',
    urlName: 'Explore paths',
    url: '/operate',
    isExternal: false,
  },
];

export const GetInvolved = () => (
  <SectionWrapper id="get-involved">
    <div className="max-w-[872px] mx-auto">
      <h2
        className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-6 `}
      >
        Get Involved
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
              <ExternalLink href={url} className="mt-auto">
                {urlName}
              </ExternalLink>
            ) : (
              <Link href={url} className="text-purple-600 mt-auto">
                {urlName}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
