import Link from 'next/link';
import Image from 'next/image';
import { H1 } from '../ui/typography';
import SectionWrapper from '../Layout/SectionWrapper';

export const WhitepaperPage = () => (
  <SectionWrapper>
    <div>
      <H1>Whitepaper</H1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 mt-8">
        <Link href="/documents/whitepaper/Whitepaper Summary v1.0.pdf">
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
        <Link href="/documents/whitepaper/Whitepaper v1.0.pdf">
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
        <Link href="/documents/whitepaper/Autonolas_Tokenomics_Core_Technical_Document.pdf">
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
        <Link href="https://staking.olas.network/poaa-whitepaper.pdf">
          <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 h-full">
            <Image
              alt="Proof of Active Agent icon"
              className="object-cover w-24 h-24 rounded-lg"
              height={100}
              width={100}
              src="/images/whitepaper/poaa-whitepaper.png"
              objectFit="cover"
            />
            <h3 className="font-bold text-xl mt-4 text-center">Proof of Active Agent (PoAA)/Olas Staking</h3>
          </div>
        </Link>
      </div>
    </div>
  </SectionWrapper>
);
