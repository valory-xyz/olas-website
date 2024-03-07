import Image from 'next/image';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';

function NetworkRole() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 text-center">
      <SectionHeading color="text-purple-950">Network Role</SectionHeading>
      <Image
        className="mx-auto mb-24"
        alt="OLAS Utility"
        src="/images/bonds-page/network-role.svg"
        width="1076"
        height="474"
      />
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-4 lg:w-3/4 mx-auto">
        Bonding plays an important role for Olas - it capitalizes the protocol.
        This capital - called protocol-owned liquidity - and in particular its yield,
        can be used to eventually replace Olas emissions to developers and bonders.
      </div>
    </SectionWrapper>
  );
}

export default NetworkRole;
