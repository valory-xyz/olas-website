import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

const Framework = () => {
  return (
    <SectionWrapper customClasses="py-12" backgroundType={"SUBTLE_GRADIENT"}>
      <div
        className={`container flex flex-col px-6 pt-10 mx-auto space-y-6 lg:py-16 lg:flex-row lg:items-center`}
      >
        <div className="w-full lg:w-1/2">
          <Image
            src="/images/open-autonomy-logo.svg"
            alt="Open Autonomy"
            width="300"
            height="90"
            className="mb-6"
          />
          <div className="lg:max-w-lg">
            <h2 className="text-heading mb-6 text-purple-950">
              Exponential growth through composability
            </h2>
            <p className="text-xl mb-6">
              Open Autonomy is Olas&apos; open-source coding framework. It&apos;s designed
              from the ground up around leading multi-agent systems principles.
            </p>
            <p className="text-xl mb-6">
              For the first time, there is a full framework capable of building
              any off-chain service.
            </p>
            <a
              href="https://docs.autonolas.network/open-autonomy"
              className="text-2xl text-link text-primary"
            >
              Dive into the docs
            </a>
            <a
              href="https://docs.autonolas.network/open-autonomy"
              className="text-2xl text-link text-primary"
            >
              Dive into the docs
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="max-w-sm rounded overflow-hidden mb-12 border">
            <Image
              className="w-full"
              src="/images/framework-devs.png"
              alt="Sunset in the mountains"
              width={384}
              height={100}
            />
            <div className="p-6">
              <p className="text-xl">
                Developers create new infra services at breakneck speed
              </p>
            </div>
          </div>
          <div className="max-w-sm rounded overflow-hidden border">
            <Image
              className="w-full"
              src="/images/framework-dao.png"
              alt="Sunset in the mountains"
              width={384}
              height={100}
            />
            <div className="p-6">
              <p className="text-xl">
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
