import Image from "next/image";

function Flywheel() {
  return (
    <section className="text-center py-12 bg-gradient-conic">
      <h2 className="text-heading text-center mb-12">Capital, meet code.</h2>
      <div className="text-paragraph mb-24 w-1/2 mx-auto">
        The Olas protocol creates an economic whirlpool, sucking in code for
        services and funds.
      </div>
      <div className="h-64 sm:h-80 lg:h-full">
        <Image
          alt="Placeholder"
          src="/path/to/your/image.jpg"
          width={700}
          height={450}
        />
      </div>
      <div className="p-8 sm:p-16 lg:p-24">
        <div className="text-paragraph mb-12  w-1/2 mx-auto">
          The whirlpool powers a generator for new services.
        </div>
        <div className="text-paragraph mb-12  w-1/2 mx-auto">
          Bonders and developers are incentivized to provide code and capital to
          the system.
        </div>
        <div className="text-paragraph mb-12  w-1/2 mx-auto">
          Olas uses this code and capital to build protocol-owned services.
          These return revenue to the DAO.
        </div>
        <div className="text-paragraph  w-1/2 mx-auto">
          The capital also provides financial returns to the DAO.
        </div>
      </div>
    </section>
  );
}

export default Flywheel;
