import Image from 'next/image';
import Link from 'next/link';

import {
  CORE_TECHNICAL_DOCUMENT,
  WHITEPAPER,
  WHITEPAPER_SUMMARY,
} from 'common-util/constants';
import SectionWrapper from '../Layout/SectionWrapper';
import { H1 } from '../ui/typography';

export const WhitepaperPage = () => (
  <SectionWrapper>
    <div>
      <H1>Whitepaper</H1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 mt-8">
        <Link href={WHITEPAPER_SUMMARY} target="_blank">
          <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
            <Image
              alt="Summary icon"
              className="object-cover w-24 h-24 rounded-lg"
              height={100}
              width={100}
              src="/images/whitepaper/autonolas-whitepaper-summary.svg"
              objectFit="cover"
            />
            <h3 className="font-bold text-xl mt-4 text-center">Summary</h3>
          </div>
        </Link>
        <Link href={WHITEPAPER} target="_blank">
          <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
            <Image
              alt="Whitepaper icon"
              className="object-cover w-24 h-24 rounded-lg"
              height={100}
              width={100}
              src="/images/whitepaper/autonolas-whitepaper.svg"
              objectFit="cover"
            />
            <h3 className="font-bold text-xl mt-4 text-center">Whitepaper</h3>
          </div>
        </Link>
        <Link href={CORE_TECHNICAL_DOCUMENT} target="_blank">
          <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
            <Image
              alt="Tokenomics icon"
              className="object-cover w-24 h-24 rounded-lg"
              height={100}
              width={100}
              src="/images/whitepaper/autonolas-tokenomics.png"
              objectFit="cover"
            />
            <h3 className="font-bold text-xl mt-4 text-center">Tokenomics</h3>
          </div>
        </Link>
        <Link
          href="/documents/whitepaper/PoAA Whitepaper.pdf"
          target="_blank"
          className="text-slate-800 hover:text-slate-800"
        >
          <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
            <Image
              alt="Proof of Active Agent icon"
              className="object-cover w-24 h-24 rounded-lg"
              height={100}
              width={100}
              src="/images/whitepaper/poaa-whitepaper.png"
              objectFit="cover"
            />
            <h3 className="font-bold text-xl mt-4 text-center">
              Proof of Active Agent (PoAA)/Olas Staking
            </h3>
          </div>
        </Link>
      </div>
    </div>
  </SectionWrapper>
);
