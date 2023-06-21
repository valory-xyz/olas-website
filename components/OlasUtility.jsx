import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

function OlasUtility() {
  return (
    <SectionWrapper customClasses="p-24 text-center">
      <h2 className="text-heading text-center mb-12">The OLAS Token</h2>
      <div className="text-paragraph mb-24 w-1/2 mx-auto">
        The OLAS token has voting escrow (ve), Olympus-inspired bonding and staking
        mechanisms built-in.
      </div>
      <Image
        className="mx-auto"
        alt="OLAS Utility"
        src="/images/olas-utility.svg"
        width="1076"
        height="474"
      />
      <div className="p-8 sm:p-16 lg:p-24">
        <div className="text-paragraph mb-12  w-1/2 mx-auto">
          Bond, stake and lock OLAS to contribute to shaping the network.
        </div>
      </div>
    </SectionWrapper>
  );
}

export default OlasUtility;
