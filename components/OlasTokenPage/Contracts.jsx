import React from "react";

import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const Contracts = () => (
  <SectionWrapper
    customClasses="border-b border-t px-8 py-12 lg:p-24"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div>
      <SectionHeading
        size="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl lg:mb-10 text-center"
        color="text-black"
      >
        Contracts
      </SectionHeading>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border-2 border-grey-600 rounded-lg p-6 bg-white">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-black">OLAS on Ethereum</h3>
          </div>
          <p className="text-lg">Contract Address: 0x0001a...5cb0</p>
          <a
            href="https://etherscan.io/token/0x0001a500a6b18995b03f44bb040a5ffc28e45cb0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-purple-600 underline"
          >
            View on Etherscan
          </a>
        </div>
        <div className="border-2 border-grey-600 rounded-lg p-6 bg-white">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-black">
              Bridged OLAS on Gnosis Chain
            </h3>
          </div>
          <p className="text-lg">Contract Address: 0xce11e...9d9f</p>
          <a
            href="https://gnosisscan.io/token/0xce11e14225575945b8e6dc0d4f2dd4c570f79d9f"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-purple-600 underline"
          >
            View on GnosisScan
          </a>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

export default Contracts;
