import Image from "next/image";
import React from "react";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";
import { CTA } from "./utils";
import { TEXT } from "@/styles/globals";

const Hero = () => {
  return (
    <SectionWrapper customClasses='py-16 border-b' backgroundType={"SUBTLE_GRADIENT"}>
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <div className="mb-6 text-xl tracking-widest uppercase text-slate-700">Olas Operate</div>
          <SectionHeading size="text-6xl sm:text-7xl lg:text-5xl xl:text-6xl lg:mb-12" color="text-purple-900">
            Run agents, stake &
            <br />
            earn rewards*
          </SectionHeading>
          <a
            href={CTA}
            class="mb-8 inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Operate now
          </a>
          <div className={TEXT}>
            *rewards are dependent on individual agent implementations as well as operator performance.
          </div>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image src="/images/operate-page/operate-hero.svg" alt="hero" width={638} height={596} className="mx-auto w-3/4 xl:w-full" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;
