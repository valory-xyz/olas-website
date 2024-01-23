import { TITLE } from "styles/globals";
import SectionHeading from "../SectionHeading";
import Image from "next/image";

export const WhitepaperPage = () => (
  <>
    <SectionHeading className={TITLE}>Whitepaper</SectionHeading>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-1 md:col-span-1 xs:col-span-1">
        <a href="/documents/whitepaper/Whitepaper Summary v1.0.pdf" className="block p-8 text-center border-r-5 border-b-5 border-purple-500 rounded-lg bg-white transition-shadow hover:bg-gray-200">
          {/* <Image
            fill='cover'
            src="/images/whitepaper/autonolas-whitepaper-summary.svg"
            alt="Autonolas whitepaper summary"
          /> */}
          <SectionHeading level={2}>Summary</SectionHeading>
        </a>
      </div>

      <div className="lg:col-span-1 md:col-span-1 xs:col-span-1">
        <a href="/documents/whitepaper/Whitepaper v1.0.pdf" className="block p-8 text-center border-r-5 border-b-5 border-purple-500 rounded-lg bg-white transition-shadow hover:bg-gray-200">
          {/* <Image
            fill='cover'
            src="/images/whitepaper/autonolas-whitepaper.svg"
            alt="Autonolas whitepaper"
          /> */}
          <SectionHeading level={2}>Whitepaper</SectionHeading>
        </a>
      </div>

      <div className="lg:col-span-1 md:col-span-1 xs:col-span-1">
        <a href="/documents/whitepaper/Autonolas_Tokenomics_Core_Technical_Document.pdf" className="block p-8 text-center border-r-5 border-b-5 border-purple-500 rounded-lg bg-white transition-shadow hover:bg-gray-200">
          {/* <Image
            fill='cover'
            src="/images/whitepaper/autonolas-tokenomics.png"
            alt="Autonolas Tokenomics"
          /> */}
          <SectionHeading level={2}>Tokenomics</SectionHeading>
        </a>
      </div>
    </div>
  </>
);
