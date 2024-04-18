import Image from 'next/image';

function ForDevs() {
  return (
    <section>
      <div className="p-2 mx-auto max-w-screen-2xl lg:p-24">
        <div className="relative z-10 bg-white lg:py-24 py-8 px-4 text-center lg:rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-purple-900 text-5xl mb-8 font-extrabold">
              Liquidity mining,
              <br />
              but for code
            </h2>
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
          <h3 className="text-xl font-light text-gray-600 mb-6">
            Devs can receive rewards when they contribute service code.
          </h3>
          <p className="text-xl font-light text-gray-600">
            Better contributions, more rewards.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForDevs;
