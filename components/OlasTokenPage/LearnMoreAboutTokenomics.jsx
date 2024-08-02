import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import {
  CORE_TECHNICAL_DOCUMENT,
  WHITEPAPER_SUMMARY,
} from 'common-util/constants';

const list = [
  {
    title: 'Tokenomics Dev Documentation',
    urlName: 'Learn more',
    url: 'https://docs.autonolas.network/protocol/tokenomics/',
    isExternal: true,
  },
  {
    title: 'Olas Whitepaper',
    urlName: 'Learn more',
    url: WHITEPAPER_SUMMARY,
    isExternal: true,
  },
  {
    title: 'Olas Tokenomics Core Technical Doc',
    urlName: 'Learn more',
    url: CORE_TECHNICAL_DOCUMENT,
    isExternal: true,
  },
];

export const LearnMoreAboutTokenomics = () => (
  <SectionWrapper>
    <h2
      className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-6 `}
    >
      Learn more about tokenomics
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
            <a href={url} target="_blank" rel="noreferrer" className="text-purple-600">
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
  </SectionWrapper>
);
