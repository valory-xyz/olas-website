import { SUB_HEADER_CLASS } from 'common-util/classes';
import Markdown from 'common-util/Markdown';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import quotes from 'data/TrustedBy.json';
import Image from 'next/image';
import Link from 'next/link';

export const TrustedBy = () => (
  <SectionWrapper
    id="social-proof"
    customClasses="lg:p-24 px-4 py-20 mt-20"
    backgroundType="NONE"
  >
    <h2 className={`${SUB_HEADER_CLASS} text-center mb-6 lg:mb-14`}>
      Trusted by Leading Web3 Teams and Users
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {quotes.map((quote, index) => {
        return (
          <Card
            key={index}
            className="flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-slate-50"
          >
            <div className="text-purple-600">
              <Markdown className="text-black">{quote.quote}</Markdown>
              {quote.blogUrl && (
                <div className="mt-4 font-semibold">
                  <Link href={quote.blogUrl}>Read more</Link>
                </div>
              )}
            </div>
            <div className="mt-auto flex flex-row gap-3">
              <div className="aspect-square mt-auto">
                <Image
                  src={`/images/homepage/${quote.userIcon || quote.icon}`}
                  alt="Build"
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col mr-auto">
                <a
                  href={quote.nameUrl}
                  target="_blank"
                  className="font-semibold"
                >
                  {quote.name}
                </a>
                <p className="text-slate-500 text-sm">{quote.title}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </SectionWrapper>
);
