import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

function NetworkRole() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 text-center">
      <SectionHeading color="text-purple-950">Network Role</SectionHeading>
      <Image
        className="mx-auto mb-24"
        alt="OLAS Utility"
        src="/images/dev-rewards-page/network-role.svg"
        width="1076"
        height="474"
      />
      <div className="text-3xl font-light tracking-tight text-gray-600 leading-normal mb-4 lg:w-3/4 mx-auto max-w-screen-md">
        Dev Rewards incentivize supply-side developers to add code to Olas Protocol Registry. This code can be used to generate services for demand-side devs to consume.
      </div>
    </SectionWrapper>
  );
}

export default NetworkRole;
