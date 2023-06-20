import Image from "next/image";

function ForDAOs() {
  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
          <div className="relative z-10 lg:py-16">
            <div className="relative h-64 sm:h-80 lg:h-full">
              <Image
                alt="Placeholder"
                src="/path/to/your/image.jpg"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="relative flex items-center bg-gray-100">
            <span className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"></span>
            <div className="p-8 sm:p-16 lg:p-24">
              <h2 className="text-heading text-center mb-4">
                A new wind for your sails
              </h2>
              <h3 className="text-paragraph mb-4">
                Olas delivers a revolutionary staking model for your favorite
                projects' tokens.
              </h3>
              <p className="text-paragraph mb-4">
                DAOs compose services and power them with their own token.
              </p>
              <p className="text-paragraph">When DAOs win, Olas wins.</p>
            </div>
          </div>
          <Image
            src="/images/loves.svg"
            alt="Olas loves your token"
            width={324}
            height={68}
          />
        </div>
      </div>
    </section>
  );
}

export default ForDAOs;
