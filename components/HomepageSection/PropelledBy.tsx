import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import partners from 'data/partners.json';
import quotes from 'data/trustedBy.json';
import { Trustee } from './Trustee';

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
      <h2 className={`${SUB_HEADER_CLASS} mb-6 lg:mb-14`}>
        Trusted by Users and Leading Crypto Teams
      </h2>
      <QuoteCarousel />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
        {partners.map((partner) => {
          const { id, name, url, imageSrc, imageWidth, imageHeight, isInternal } = partner;
          const LinkTag = isInternal ? Link : 'a';
          return (
            <div key={id} className="grayscale flex justify-center items-center">
              <LinkTag
                href={url}
                {...(isInternal
                  ? {}
                  : {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
              >
                <Image
                  src={imageSrc}
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
