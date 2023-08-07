import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";
import { CTA } from "./utils";

function HowItWorks() {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12">
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 px-5 lg:p-0 mb-12">
          <SectionHeading>How it Works</SectionHeading>
          <ol className="text-xl text-slate-800 list-decimal leading-loose">
            <li><a href={CTA} className="text-primary">Browse</a> for bonding products</li>
            <li>Get LP tokens on <a href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0' rel="noopener noreferrer" target="_blank" className="text-primary">Uniswap</a></li>
            <li>Bond LP tokens via <a href={CTA} className="text-primary">app</a></li>
            <li>Wait for bond to mature, then claim discounted OLAS</li>
          </ol>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            className="mx-auto"
            alt="OLAS Utility"
            src="/images/bonds-page/how-it-works.png"
            width="500"
            height="474"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

export default HowItWorks;
