import Link from "next/link";
import Image from "next/image";

export const WhitepaperPage = () => (
  <section className="max-w-screen-xl mx-auto p-4 mb-48">
    <div>
      <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">Whitepaper</h2>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8 mt-8">
        <Link href="/documents/whitepaper/Whitepaper Summary v1.0.pdf">
            <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4">
              <Image
                alt="Summary Icon"
                className="object-cover w-24 h-24 rounded-lg"
                height={100}
                width={100}
                src="/images/whitepaper/autonolas-whitepaper-summary.svg"
                objectFit="cover"
              />
              <h3 className="font-bold text-xl mt-4">Summary</h3>
            </div>
        </Link>
        <Link href="/documents/whitepaper/Whitepaper v1.0.pdf">
            <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4">
              <Image
                alt="Whitepaper Icon"
                className="object-cover w-24 h-24 rounded-lg"
                height={100}
                width={100}
                src="/images/whitepaper/autonolas-whitepaper.svg"
                objectFit="cover"
              />
              <h3 className="font-bold text-xl mt-4">Whitepaper</h3>
            </div>
        </Link>
        <Link href="/documents/whitepaper/Autonolas_Tokenomics_Core_Technical_Document.pdf">
            <div className="flex flex-col items-center justify-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4">
              <Image
                alt="Tokenomics Icon"
                className="object-cover w-24 h-24 rounded-lg"
                height={100}
                width={100}
                src="/images/whitepaper/autonolas-tokenomics.png"
                objectFit="cover"
              />
              <h3 className="font-bold text-xl mt-4">Tokenomics</h3>
            </div>
        </Link>
      </div>
    </div>
  </section>
);
