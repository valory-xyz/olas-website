import Image from 'next/image';
import SectionWrapper from '@/components/Layout/SectionWrapper';

function ForDAOs() {
  return (
    <section className=" bg-white border-y">
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative z-10 lg:py-16">
            <div className="relative mb-6">
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
              <h2 className="text-5xl text-slate-800 font-extrabold lg:mb-6">A new wind for your sails</h2>
              <h3 className="text-xl font-light text-gray-600 leading-normal sm:mb-8 ">
                Olas delivers a novel staking model for your favorite
                projects&apos; tokens.
              </h3>
              <p className="text-xl font-light text-gray-600 leading-normal sm:mb-8 ">
                DAOs compose services and power them with their own token.
              </p>
              <p className="text-xl font-light text-gray-600 leading-normal mb-8 ">When DAOs win, Olas wins.</p>
              <Image
                src="/images/loves.svg"
                alt="Olas loves your token"
                width={324}
                height={68}
                className="mx-auto lg:mx-0"
              />
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}

export default ForDAOs;
