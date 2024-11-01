import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export function OlasUtility() {
  return (
    <SectionWrapper
      customClasses="lg:p-24 px-4 py-12 text-center"
      id="olas-token"
    >
      <div className="text-5xl font-bold mb-8 tracking-tight text-black text-center">
        Utility
      </div>
      <p className="text-lg font-light tracking-tight text-gray-600 leading-normal">
        OLAS provides access to the core functions of the network.
      </p>
      <p className="text-lg font-light tracking-tight text-gray-600 leading-normal mb-12">
        Build, bond, operate, contribute, launch and lock OLAS to shape the
        network.
      </p>
      <Link href="/#get-involved-1">
        <Card className="border-1.5 border-gray-200 max-sm:border-none max-sm:shadow-none rounded-2xl overflow-hidden hover:border-purple-500 max-h-[800px]">
          <div className="transition-transform duration-300 ease-in-out transform hover:scale-105 md:p-16">
            <Image
              className="mx-auto my-auto object-cover"
              alt="OLAS Utility"
              src="/images/get-involved-diagram.png"
              width="920"
              height="595"
            />
          </div>
        </Card>
      </Link>
    </SectionWrapper>
  );
}
