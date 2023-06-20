import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section class="bg-white">
      <div class="grid max-w-screen-xl py-10 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-6">
          <h1 class="text-heading mb-4">
            Crypto&apos;s ocean<br />of services
          </h1>
          <p class="mb-6 text-2xl">
            One single network for all the stuff that makes crypto work.
            Coordinated by the OLAS token, built on cutting edge autonomous
            agent technology.
          </p>
          <a
            href="#"
            class="inline-flex items-center justify-center px-6 py-4 text-xl font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Get involved
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-6 lg:flex">
          <Image src="/images/hero.svg" alt="hero" width={834} height={742} className="mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
