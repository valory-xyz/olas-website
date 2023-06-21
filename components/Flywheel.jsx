import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

function Flywheel() {
  return (
    <SectionWrapper customClasses='text-center py-12' backgroundType={"SUBTLE_GRADIENT"}>
    
      <Image
        src="/images/whirlpool-icon.png"
        alt="Whirlpool icon"
        width={200}
        height={200}
        className="mx-auto rounded-3xl shadow-lg mb-12"
      />
      <h2 className="text-heading text-center mb-12 text-purple-950">Capital, meet code.</h2>
      <div className="text-paragraph mb-24 w-1/2 mx-auto">
        The Olas protocol creates an economic whirlpool, sucking in code for
        services and funds.
      </div>
      <div className="h-64 sm:h-80 lg:h-full">
        <Image
          alt="Placeholder"
          src="/images/whirlpool.svg"
          width="1295" height="480"
          className="mx-auto"
        />
      </div>
      <div className="p-8 sm:p-16 lg:p-24">
        <div className="text-2xl text-gray-600 mb-12  w-1/2 mx-auto">
          The whirlpool powers a generator for new services.
        </div>
        <div className="text-2xl text-gray-600 mb-12  w-1/2 mx-auto">
          Bonders and developers are incentivized to provide code and capital to
          the system.
        </div>
        <div className="text-2xl text-gray-600 mb-12  w-1/2 mx-auto">
          Olas uses this code and capital to build protocol-owned services (PoSe).
          These contribute to revenue for the DAO.
        </div>
        <div className="text-2xl text-gray-600  w-1/2 mx-auto">
          The capital also provides financial returns to the DAO.
        </div>
      </div>
    </SectionWrapper>
  );
}

export default Flywheel;
