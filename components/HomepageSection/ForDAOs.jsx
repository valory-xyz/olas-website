import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

function ForDAOs() {
  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
          <div className="relative z-10 lg:py-16">
            <div className="relative h-64 sm:h-80 lg:h-full mb-6">
              <Image
                alt="Placeholder"
                src="/images/ForDAOs.svg"
                width="1494"
                height="1189"
              />
            </div>
          </div>
          <SectionWrapper customClasses="relative flex items-center bg-gray-50">
            <div className="p-8 sm:p-16 lg:p-24 text-center lg:text-left">
              <SectionHeading>A new wind for your sails</SectionHeading>
              <h3 className="text-2xl mb-4 text-gray-600">
                Olas delivers a novel staking model for your favorite
                projects&apos; tokens.
              </h3>
              <p className="text-2xl mb-4 text-gray-600">
                DAOs compose services and power them with their own token.
              </p>
              <p className="text-2xl mb-12 text-gray-600">When DAOs win, Olas wins.</p>
              <Image
                src="/images/loves.svg"
                alt="Olas loves your token"
                width={324}
                height={68}
              />
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}

export default ForDAOs;
