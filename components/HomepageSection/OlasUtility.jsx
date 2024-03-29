import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';

function OlasUtility() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 text-center">
      <div id="olas-token" />
      <SectionHeading color="text-purple-950">Utility</SectionHeading>
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-4 lg:w-3/4 mx-auto">
        OLAS provides access to the core functions of the network.
      </div>
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-12 lg:w-3/4 mx-auto">
        Bond, stake and lock OLAS to contribute to shaping the network.
      </div>
      <Image
        className="mx-auto mb-24"
        alt="OLAS Utility"
        src="/images/olas-utility.svg"
        width="1076"
        height="474"
      />
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-24 lg:w-3/4 mx-auto">
        The OLAS token has voting escrow (ve), Olympus-inspired bonding and
        staking mechanisms built-in.
      </div>
    </SectionWrapper>
  );
}

export default OlasUtility;
