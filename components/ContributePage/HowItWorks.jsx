import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";
import { CTA_LINK } from "./utils";

function HowItWorks() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12">
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 px-5 lg:p-0 mb-12">
          <SectionHeading>Get started</SectionHeading>
          <ol className="text-xl text-slate-800 list-decimal leading-loose">
            <li><a href={CTA_LINK} rel="noopener noreferrer" target="_blank"  className="text-primary">Visit Olas Contribute</a></li>
            <li>Connect your Twitter account</li>
            <li>Start posting about Olas, mentioning @autonolas and #OlasNetwork</li>
            <li>See your recognition points automatically roll in</li>
          </ol>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            className="mx-auto"
            alt="OLAS Utility"
            src="/images/contribute-page/how-it-works.png"
            width="500"
            height="474"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

export default HowItWorks;
