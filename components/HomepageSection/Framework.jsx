import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const Framework = () => {
  return (
    <SectionWrapper customClasses="py-12" backgroundType={"SUBTLE_GRADIENT"}>
      <div
        className={`container flex flex-col px-6 pt-10 mx-auto space-y-6 lg:py-16 lg:flex-row lg:items-center`}
      >
        <div className="w-full  xl:w-1/2">
          <Image
            src="/images/open-autonomy-logo.svg"
            alt="Open Autonomy"
            width="300"
            height="90"
            className="mb-6"
          />
          <div className="lg:max-w-lg">
            <h2 className="text-5xl text-slate-800 font-extrabold mb-8">
              Exponential growth through composability
            </h2>
            <p className="text-xl font-light text-gray-600 mb-6">
              Open Autonomy is Olas&apos; open-source coding framework.
              It&apos;s designed from the ground up around leading multi-agent
              systems principles.
            </p>
            <p className="text-xl font-light text-gray-600 mb-6">
              For the first time, there is a full framework capable of building
              any off-chain service.
            </p>
            <a
              href="https://docs.autonolas.network/open-autonomy"
              className="text-xl font-light text-link text-primary"
            >
              Dive into the docs ↗
            </a>
          </div>
        </div>
        <div className="w-full xl:w-1/2">
          <div className="rounded overflow-hidden mb-12 border">
            <div className="border-b">
              <Image
                className="w-full"
                src="/images/framework-devs.svg"
                alt="Sunset in the mountains"
                width={250}
                height={200}
              />
            </div>
            <div className="p-6 bg-white">
              <p className="text-2xl font-light text-gray-600 text-center">
                Developers create new infra services at breakneck speed
              </p>
            </div>
          </div>
          <div className="rounded overflow-hidden border">
            <div className="border-b">
              <Image
                className="w-full"
                src="/images/framework-dao.svg"
                alt="Sunset in the mountains"
                width={250}
                height={200}
              />
            </div>
            <div className="p-6 bg-white">
              <p className="text-2xl font-light text-gray-600 text-center">
                Crypto projects combine services to meet their specific needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Framework;
