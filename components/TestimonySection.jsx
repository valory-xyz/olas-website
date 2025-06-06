import { SUB_HEADER_CLASS } from 'common-util/classes';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from './Layout/SectionWrapper';
import { Card } from './ui/card';
import { ExternalLink } from './ui/typography';

export const TestimonySection = ({
  id,
  isQuote = false,
  folderName,
  title,
  list,
}) => (
  <SectionWrapper
    id={id}
    customClasses="px-4 py-16 border-y bg-gradient-to-t from-[#E7EAF4] to-gray-50"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6`}>{title}</h2>
    {isQuote ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {list.map((item, index) => (
          <Card
            key={index}
            className='flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 mx-auto bg-cover bg-[url("/images/card-bg.png")]'
          >
            <a href={item.projectUrl} target="_blank">
              <Image
                src={`/images/${folderName}/${item.projectImage}`}
                alt={`project ${index}`}
                width={24}
                height={24}
                className="mx-auto"
              />
            </a>
            <div className="text-purple-600">
              &quot;
              <span className="text-black">{item.quote}</span>
              &quot;
              {item.blogUrl && (
                <div className="mt-4 font-semibold">
                  <Link href={item.blogUrl}>Read more</Link>
                </div>
              )}
            </div>
            <div className="mt-auto flex flex-row justify-between">
              <div className="flex flex-col w-2/3 max-w-[200px]">
                <a
                  href={item.nameUrl}
                  target="_blank"
                  className="font-semibold"
                >
                  {item.name}
                </a>
                <p className="text-slate-500 text-sm">{item.title}</p>
              </div>

              <div className="aspect-square mt-auto">
                <Image
                  src={`/images/${folderName}/${item.avatar}`}
                  alt={`quotee ${index}`}
                  width={48}
                  height={48}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <div className="flex flex-col flex-wrap w-fit lg:max-h-[570px] mx-auto">
        {list.map((item, index) => (
          <ExternalLink href={item.linkUrl} key={index} hideArrow>
            <Image
              src={`/images/${folderName}/${item.imgSrc}`}
              alt={`tweet ${index}`}
              width={500}
              height={200}
            />
          </ExternalLink>
        ))}
      </div>
    )}
  </SectionWrapper>
);
