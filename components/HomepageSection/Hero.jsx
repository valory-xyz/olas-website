import Image from "next/image";
import React from "react";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const Hero = () => {
  return (
    <SectionWrapper customClasses='py-16' backgroundType={"SUBTLE_GRADIENT"}>
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <SectionHeading size="text-6xl sm:text-7xl lg:text-5xl xl:text-7xl lg:mb-6" color="text-purple-900">
            Crypto&apos;s <span className="bg-dark-hexagons1 bg-repeat bg-size-50 background-clip">ocean</span><br />of services
          </SectionHeading>
          <p class="mb-6 text-3xl font-light tracking-tight text-gray-600 leading-normal">
            One single network for all the stuff that makes crypto work.
            Coordinated by the OLAS token, built on cutting edge autonomous
            agent technology.
          </p>
          <a
            href="https://contribute.olas.network"
            class="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get involved
          </a>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image src="/images/hero.svg" alt="hero" width={834} height={742} className="mx-auto w-3/4 xl:w-full" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;
