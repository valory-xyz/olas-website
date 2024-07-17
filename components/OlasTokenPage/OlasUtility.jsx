import Image from 'next/image';
import SectionWrapper from 'components/Layout/SectionWrapper';

function OlasUtility() {
  return (
    <SectionWrapper
      customClasses="lg:p-24 px-4 py-12 text-center"
      id="olas-token"
    >
      <div className="text-5xl font-bold mb-8 tracking-tight text-black text-center">
        Utility
      </div>
      <p className="text-lg font-light tracking-tight text-gray-600 leading-normal">
        OLAS provides access to the core functions of the network.
      </p>
      <p className="text-lg font-light tracking-tight text-gray-600 leading-normal mb-12">
        Code, bond, operate and lock OLAS to contribute to shaping the network.
      </p>
      <Image
        className="mx-auto mb-24"
        alt="OLAS Utility"
        src="/images/olas-utility.png"
        width="1312"
        height="494"
      />
    </SectionWrapper>
  );
}

export default OlasUtility;
