import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

function GetStarted() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12">
      <div id="get-started"></div>
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 px-5 lg:p-0 mb-12">
          <SectionHeading>Start earning rewards</SectionHeading>
          <ol className="text-xl text-slate-800 list-decimal mb-6 pl-5 leading-loose">
            <li>Write code using <a href='https://docs.autonolas.network/open-autonomy' className="text-primary">Open Autonomy</a></li>
            <li>Mint your code on <a href='https://registry.olas.network/services/mint' className="text-primary">Olas Protocol Registry</a></li>
            <li>Get rewards in ETH & OLAS*</li>
          </ol>
          <div className="text-slate-500">*Requires that somebody with at least 10k veOLAS donates to a service that uses your code.</div>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            className="mx-auto"
            alt="OLAS Utility"
            src="/images/dev-rewards-page/get-started.png"
            width="500"
            height="474"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

export default GetStarted;
