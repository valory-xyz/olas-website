import { SUB_HEADER_CLASS, TEXT_CLASS } from 'common-util/classes';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import SectionWrapper from './Layout/SectionWrapper';

export const GetInvolvedCards = ({ title = 'Get Involved', list }) => {
  const listLength = list.length;
  let sectionWidth = '';

  if (listLength === 2) sectionWidth = 'max-w-screen-xl';

  return (
    <SectionWrapper>
      <h2
        className={`${SUB_HEADER_CLASS} lg:text-center lg:mb-14 text-left mb-6 `}
      >
        {title}
      </h2>

      <div
        className={`${sectionWidth} mx-auto grid grid-cols-1 gap-8 md:grid-cols-${listLength}`}
      >
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
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600"
              >
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
};
