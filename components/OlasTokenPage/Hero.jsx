import React from "react";
import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const Hero = () => {
  return (
    <SectionWrapper customClasses="py-16 border-y">
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <div className="mb-6 text-lg tracking-widest uppercase">
            OLAS Token
          </div>
          <SectionHeading
            size="text-6xl sm:text-7xl lg:text-5xl xl:text-6xl lg:mb-12"
            color="text-black"
          >
            Unlock the Olas network
          </SectionHeading>
          <h2 class="text-xl font-bold mb-4">Get OLAS</h2>
          <a
            href="https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x0001a500a6b18995b03f44bb040a5ffc28e45cb0"
            class="inline-flex bg-white text-black items-center justify-center px-4 py-3 text-lg sm:text-2xl lg:text-lg sm:px-6 sm:py-4 text-center border-2 border-grey-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-800 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-4 lg:py-3 mr-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/olas-token-page/uniswap.svg"
              alt="uniswap"
              width={20}
              height={20}
              className="mr-2"
            />
            On Ethereum
          </a>
          <a
            href="https://app.balancer.fi/#/gnosis-chain/pool/0x79c872ed3acb3fc5770dd8a0cd9cd5db3b3ac985000200000000000000000067"
            class="inline-flex bg-white text-black items-center justify-center px-4 py-3 text-lg sm:text-2xl lg:text-lg sm:px-6 sm:py-4 text-center border-2 border-grey-600 rounded-lg hover:bg-green-900 hover:text-yellow-300 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-4 lg:py-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/olas-token-page/balancer.svg"
              alt="balancer"
              width={20}
              height={20}
              className="mr-2"
            />
            On Gnosis Chain
          </a>
          <br />
          <br />
          <a
            href="https://omni.gnosischain.com/bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-slate-500"
          >
            Alternatively, bridge OLAS to Gnosis Chain via Omnibridge
          </a>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            src="/images/olas-token-page/hero.png"
            alt="hero"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;
