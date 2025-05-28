import Link from 'next/link';

import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';

const list = [
  {
    title: 'Contribute a Strategy',
    desc: 'Built a trading bot? Expert trader? Share your knowledge and add to the strategy library.',
    urlName: 'Reach out on Discord',
    url: 'https://discord.com/invite/RHY6eJ35ar',
    isExternal: true,
  },
  {
    title: 'Build the Future of Autonomous AI Trading',
    desc: 'Developer, innovator, or AI enthusiast? Build with the Olas stack and help shape the future of autonomous AI trading.',
    urlName: 'Build on Olas',
    url: '/build',
    isExternal: false,
  },
];

export const GetInvolved = () => (
  <SectionWrapper
    customClasses="border-b-1.5 p-4 md:px-8 py-16 md:pb-32"
    id="get-involved"
  >
    <div className="max-w-5xl mx-auto">
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
              <ExternalLink href={url} className="text-purple-600 mt-auto">
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
