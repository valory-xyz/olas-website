import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

function OlasUtility() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 text-center">
      <SectionHeading color="text-purple-950">The OLAS Token</SectionHeading>
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-24 lg:w-3/4 lg:w-1/2 mx-auto">
        The OLAS token has voting escrow (ve), Olympus-inspired bonding and staking
        mechanisms built-in.
      </div>
      <Image
        className="mx-auto mb-12"
        alt="OLAS Utility"
        src="/images/olas-utility.svg"
        width="1076"
        height="474"
      />
      <div className="p-8 sm:p-16 lg:p-24">
        <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-12 lg:w-3/4 lg:w-1/2 mx-auto">
          Bond, stake and lock OLAS to contribute to shaping the network.
        </div>
      </div>
    </SectionWrapper>
  );
}

export default OlasUtility;
