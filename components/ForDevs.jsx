import Image from "next/image";

function ForDevs() {
  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="relative z-10 lg:py-16">
          <h2 className="text-heading text-center">
            Liquidity mining,
            <br />
            but for code
          </h2>
          <div className="h-64 sm:h-80 lg:h-full">
            <Image
              alt="Placeholder"
              src="/path/to/your/image.jpg"
              width={500}
              height={300}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="p-8 sm:p-16 lg:p-24">
            <h3 className="text-paragraph mb-12">
              Olas protocol rewards developers for providing service code.
            </h3>
            <p className="text-paragraph">
              Developers who provide more useful services get more rewards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForDevs;
