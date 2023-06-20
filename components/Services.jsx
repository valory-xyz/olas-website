import React from "react";
import Image from "next/image";
import services from "../data/services.json";
import core from "../data/core.json";
import apps from "../data/apps.json";

const ServiceItem = ({ service }) => {
  return (
    <a
      className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
      href={service.url}
    >
      <Image
        src={`/images/${service.iconFilename}`}
        alt={service.name}
        width={64}
        height={64}
      />
      <h2 className="mt-2 font-bold">{service.name}</h2>

      <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
        {service.description}
      </p>
    </a>
  );
};

const CoreSubsection = () => {
  return (
    <section className="bg-grey">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Core</h2>

            <p className="mt-4 text-xl">
              The key modules upon which the network rests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {core.map((core) => {
              return (
                <div key={core.id}>
                  <ServiceItem service={core} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSubsection = () => {
  return (
    <section className="bg-grey">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Services</h2>

            <p className="mt-4 text-xl">
              /
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {services.map((service) => {
              return (
                <div key={service.id}>
                  <ServiceItem service={service} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const AppsSubsection = () => {
  return (
    <section className="bg-grey">
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Apps</h2>

            <p className="mt-4 text-xl">
              There is already a growing ecosystem of apps built on Olas, consuming infra services.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {apps.map((app) => {
              return (
                <div key={app.id}>
                  <ServiceItem service={app} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <div className="p-12 bg-white">
      <div className="text-center">
        <h2 className="text-heading mb-4">Already making waves</h2>
        <div className="text-paragraph">The Olas whirlpool is spinning</div>
      </div>
      <CoreSubsection />
      <ServicesSubsection />
      <AppsSubsection />
      <div className="text-center">
        For the most up to date lists, check out the community-maintained <a href="">Awesome Autonolas</a> repo!
      </div>
    </div>
  );
};

export default Services;
