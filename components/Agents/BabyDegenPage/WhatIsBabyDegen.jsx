import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';

export const WhatIsBabyDegen = () => (
  <SectionWrapper id="about" customClasses="lg:p-24 py-12 border-b-1.5">
    <div className="grid max-w-screen-xl lg:px-16 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
      <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left lg:w-6/7">
        <h2 className={`${SUB_HEADER_CLASS} mb-8`}>What is BabyDegen?</h2>
        <p className="mb-20">
          BabyDegen is your very own autonomous trading agent, designed to
          navigate the fast-paced world of DeFi. BabyDegen trades on your behalf
          leveraging various AI models and external data sources with speed and
          skill. It&apos;s more than just a tool; it&apos;s your companion on
          your crypto trading journey.
        </p>
        <h2 className={`${SUB_HEADER_CLASS} mb-8`}>
          Get ready to participate in AI agent DeFi
        </h2>
        <p className="mb-8">
          BabyDegen is designed for anyone ready to embrace the future of
          autonomous trading. Whether you&apos;re looking to safeguard your edge
          in an evolving market or eager to explore trading without the steep
          learning curve, BabyDegen is your gateway to the next generation of
          effortless trading. Experience hands-free success with this
          cutting-edge solution.
        </p>
      </div>

      <div className="lg:mt-0 lg:col-span-4 lg:col-end-13 lg:flex">
        <Image
          src="/images/agents/babydegen/participate.webp"
          alt="Get ready to participate in AI agent DeFi"
          width={400}
          height={400}
          className="mx-auto rounded-lg"
        />
      </div>
    </div>
  </SectionWrapper>
);
