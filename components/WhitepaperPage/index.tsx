import Image from 'next/image';
import Link from 'next/link';

import { CORE_TECHNICAL_DOCUMENT, WHITEPAPER, WHITEPAPER_SUMMARY } from 'common-util/constants';
import { getSiteUrl } from 'common-util/getSiteUrl';
import { buildItemList } from 'common-util/structured-data';
import { JsonLd } from 'components/JsonLd';
import SectionWrapper from '../Layout/SectionWrapper';
import { H1 } from '../ui/typography';

/** The documents the page links to, in order. The cards and the ItemList both read this. */
const DOCUMENTS = [
  {
    title: 'Summary',
    href: WHITEPAPER_SUMMARY,
    alt: 'Summary icon',
    image: '/images/whitepaper/autonolas-whitepaper-summary.svg',
  },
  {
    title: 'Whitepaper',
    href: WHITEPAPER,
    alt: 'Whitepaper icon',
    image: '/images/whitepaper/autonolas-whitepaper.svg',
  },
  {
    title: 'Tokenomics',
    href: CORE_TECHNICAL_DOCUMENT,
    alt: 'Tokenomics icon',
    image: '/images/whitepaper/autonolas-tokenomics.png',
  },
  {
    title: 'Proof of Active Agent (PoAA)/Olas Staking',
    href: '/documents/whitepaper/PoAA Whitepaper.pdf',
    alt: 'Proof of Active Agent icon',
    image: '/images/whitepaper/poaa-whitepaper.png',
    className: 'text-slate-800 hover:text-slate-800',
  },
];

const ITEM_LIST = buildItemList({
  siteUrl: getSiteUrl(),
  path: '/whitepaper',
  name: 'Whitepaper',
  entries: DOCUMENTS.map(({ title, href }) => ({ name: title, url: href })),
});

export const WhitepaperPage = () => (
  <SectionWrapper>
    {ITEM_LIST && <JsonLd data={ITEM_LIST} />}
    <div>
      <H1>Whitepaper</H1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 mt-8">
        {DOCUMENTS.map(({ title, href, alt, image, className }) => (
          <Link key={href} href={href} target="_blank" className={className}>
            <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
              <Image
                alt={alt}
                className="object-cover w-24 h-24 rounded-lg"
                height={100}
                width={100}
                src={image}
                objectFit="cover"
              />
              <h3 className="font-bold text-xl mt-4 text-center">{title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
