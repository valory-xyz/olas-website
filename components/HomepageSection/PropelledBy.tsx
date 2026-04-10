import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import builders from 'data/builders.json';
import friends from 'data/friends.json';
import quotes from 'data/trustedBy.json';
import { Trustee } from './Trustee';

const filteredFriends = friends.filter((friend) => !friend.hidden);

const QuoteCarousel = () => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? quotes.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === quotes.length - 1 ? 0 : i + 1));

  return (
    <div className="max-w-4xl mx-auto mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Previous quote"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Next quote"
          >
            <ChevronRight size={18} />
          </button>
          <span className="text-sm text-gray-500 ml-2">
            {index + 1} / {quotes.length}
          </span>
        </div>
        <Button variant="outline" size="default" asChild>
          <Link href="/case-studies">Explore Case Studies</Link>
        </Button>
      </div>
      <Trustee quote={quotes[index]} />
    </div>
  );
};

export const PropelledBy = () => (
  <SectionWrapper customClasses="px-4 md:px-8 py-12 md:py-24" id="ecosystem">
    <section className="max-w-[900px] mx-auto text-center">
      <h2 className={`${SUB_HEADER_CLASS} mb-6 lg:mb-14`}>Trusted by ...</h2>
      <QuoteCarousel />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-10">
        {builders.map((builder) => {
          const { id, name, url, iconFilename, imageWidth, imageHeight } = builder;
          return (
            <div key={id} className="grayscale flex justify-center items-center">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/images/builders/${iconFilename}`}
                  alt={name}
                  width={imageWidth ?? 150}
                  height={imageHeight ?? 30}
                />
              </a>
            </div>
          );
        })}
        {filteredFriends.map((friend) => {
          const { id, name, url, isExternal, imageFilename, imageWidth, imageHeight } = friend;
          const LinkTag = isExternal ? 'a' : Link;
          return (
            <div key={id} className="grayscale flex justify-center items-center">
              <LinkTag
                href={url}
                {...(isExternal
                  ? {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {})}
              >
                <Image
                  src={`/images/friends/${imageFilename}`}
                  alt={name}
                  width={imageWidth ?? 150}
                  height={imageHeight ?? 30}
                />
              </LinkTag>
            </div>
          );
        })}
      </div>
    </section>
  </SectionWrapper>
);

export default PropelledBy;
