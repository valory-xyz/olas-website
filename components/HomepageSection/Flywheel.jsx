import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';

function Flywheel() {
  return (
    <SectionWrapper
      customClasses="text-center py-12 px-4"
      backgroundType="SUBTLE_GRADIENT"
    >
      <div className="text-7xl lg:text-9xl mb-12">🌀</div>
      <SectionHeading color="text-purple-900">Capital, meet code</SectionHeading>
      <div className="text-2xl font-light text-slate-800 mb-24 lg:w-3/4 xl:w-1/2 mx-auto">
        The Olas protocol is designed to create an economic whirlpool, sucking in code and funds.
      </div>
      <div className="sm:h-80 lg:h-full mb-12">
        <Image
          alt="Placeholder"
          src="/images/whirlpool.svg"
          width="600"
          height="400"
          className="mx-auto"
        />
      </div>
      <div className="p-8 sm:p-16 lg:p-24">
        <div className="text-2xl font-light text-gray-600 mb-12 lg:w-3/4 xl:w-1/2 mx-auto">
          The whirlpool powers a generator for new services.
        </div>
        <div className="text-2xl font-light text-gray-600 mb-12 lg:w-3/4 xl:w-1/2 mx-auto">
          Bonders and developers are incentivized to provide capital and code to
          the system.
        </div>
        <div className="text-2xl font-light text-gray-600 mb-12 lg:w-3/4 xl:w-1/2 mx-auto">
          Olas uses this code and capital to build protocol-owned services
          (PoSe). These contribute to revenue for the DAO.
        </div>
        <div className="text-2xl font-light text-gray-600 lg:w-3/4 xl:w-1/2 mx-auto mb-12">
          The capital also provides yield to the DAO.
          <Link href="/disclaimer" className="text-blue-500">*</Link>
        </div>

        <div className="flex justify-center space-x-3">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="animate-spin text-3xl">
              🌀
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default Flywheel;
