import Image from 'next/image';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';

function NetworkRole() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 text-center">
      <SectionHeading color="text-purple-950">Network Role</SectionHeading>
      <Image
        className="mx-auto mb-24"
        alt="Olas Contribute Network Role"
        src="/images/contribute-page/network-role.svg"
        width="1076"
        height="474"
      />
      <div className="text-2xl font-light text-gray-600 leading-relaxed mb-4 max-w-screen-md mx-auto">
        Olas Contribute is designed to assist the network by marketing important information
        to relevant stakeholders. These stakeholders could be Bonders, Supply-side Devs or
        Demand-side Devs. Contribute may evolve beyond a pure marketing function in the future.
      </div>
    </SectionWrapper>
  );
}

export default NetworkRole;
