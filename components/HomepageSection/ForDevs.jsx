import Image from "next/image";
import SectionHeading from "../SectionHeading";

function ForDevs() {
  return (
    <section>
      <div className="p-2 mx-auto max-w-screen-2xl lg:p-24 bg-dark-hexagons2 bg-repeat bg-size-25">
        <div className="relative z-10 bg-white lg:py-24 py-8 px-4 text-center lg:rounded-2xl shadow-lg">
          <div>
            <SectionHeading color="text-purple-900">
            Liquidity mining,
              <br />
              but for code
            </SectionHeading>
            <Image
              alt="Dev incentives diagram"
              src="/images/ForDevs.svg"
              width="965"
              height="132"
              className="mx-auto mb-12 hidden md:block"
            />
            <Image
              alt="Dev incentives diagram"
              src="/images/ForDevs-xs.svg"
              width="965"
              height="132"
              className="mx-auto mb-12 md:hidden"
            />
          </div>
          <h3 className="text-2xl text-gray-600 mb-12">
            Devs are rewarded when they contribute service code.
          </h3>
          <p className="text-2xl text-gray-600">
            Better contributions, more rewards.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForDevs;
