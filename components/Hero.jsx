import Image from "next/image";
import React from "react";
import SectionWrapper from "./SectionWrapper";

const Hero = () => {
  return (
    <SectionWrapper customClasses='py-16' backgroundType={"SUBTLE_GRADIENT"}>
      <div class="grid max-w-screen-xl mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-6">
          <h1 class="text-heading mb-4 text-purple-900">
            Crypto&apos;s <span className="bg-dark-hexagons1 bg-repeat bg-size-50 background-clip">ocean</span><br />of services
          </h1>
          <p class="mb-6 text-2xl text-gray-600">
            One single network for all the stuff that makes crypto work.
            Coordinated by the OLAS token, built on cutting edge autonomous
            agent technology.
          </p>
          <a
            href="#"
            class="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Get involved
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-6 lg:flex">
          <Image src="/images/hero.svg" alt="hero" width={834} height={742} className="mx-auto" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;
