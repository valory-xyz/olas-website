import Image from "next/image";

function ForDevs() {
  return (
    <section>
      <div className="mx-auto max-w-screen-2xl p-24 bg-dark-hexagons3 bg-repeat bg-size-25">
        <div className="relative z-10 bg-white py-24 text-center rounded-3xl shadow-lg">
          <div>
            <h2 className="text-heading no-leading mb-16 text-purple-900">
              Liquidity mining,
              <br />
              but for code
            </h2>
            <Image
              alt="Dev incentives diagram"
              src="/images/ForDevs.svg"
              width="965"
              height="132"
              className="mx-auto mb-12"
            />
          </div>
          <h3 className="text-2xl text-gray-600 mb-12">
            Olas protocol rewards developers for providing service code.
          </h3>
          <p className="text-2xl text-gray-600">
            Developers who provide more useful contributions get more rewards.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForDevs;
