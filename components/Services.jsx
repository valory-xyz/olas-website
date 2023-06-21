import React from "react";
import Image from "next/image";
import services from "../data/services.json";
import core from "../data/core.json";
import apps from "../data/apps.json";
import Badge from "./Badge";
import SectionWrapper from "./SectionWrapper";

const ServiceItem = ({ service }) => {
  return (
    <a
      className="block rounded-xl border border-gray-200 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
      href={service.url}
    >
      <Image
        // src={`/images/${service.iconFilename}`}
        src="/images/open-autonomy2.png"
        alt={service.name}
        width={450}
        height={200}
        className="rounded-t-xl"
      />
      <div className="p-4">
        <h2 className="mb-2 font-bold">{service.name}</h2>

        {service?.tags?.length > 0 &&
          service.tags.map((tag) => {
            return (
              <div key={service.id + tag}>
                <Badge>{tag}</Badge>
              </div>
            );
          })}
      <div className="p-4">
        <h2 className="mb-2 font-bold">{service.name}</h2>

        {service?.tags?.length > 0 &&
          service.tags.map((tag) => {
            return (
              <div key={service.id + tag}>
                <Badge>{tag}</Badge>
              </div>
            );
          })}

        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          {service.description}
        </p>
      </div>
        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          {service.description}
        </p>
      </div>
    </a>
  );
};

const CoreSubsection = () => {
  return (
    <section className="bg-grey">
      <div className="max-w-screen-xl mb-12">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Core</h2>

            <p className="mt-4 text-xl text-gray-600">
              Olas&apos; key modules.
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
      <div className="max-w-screen-xl mb-12">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Services</h2>
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
      <div className="max-w-screen-xl mb-12">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
          <div>
            <h2 className="text-paragraph">Apps</h2>

            <p className="mt-4 text-xl text-gray-600">
              There is already a growing ecosystem of apps built on Olas,
              consuming infra services.
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
    <SectionWrapper>
      <div className="text-center">
        <h2 className="text-heading mb-4 text-purple-950">Already making waves</h2>
        <div className="text-paragraph mb-12">The Olas whirlpool is spinning</div>
      </div>
      <CoreSubsection />
      <ServicesSubsection />
      <AppsSubsection />
      <div className="text-center text-2xl text-gray-600">
        For the most up to date lists,
        <br />
        check out the community-maintained{" "}
        <a
          href="https://github.com/N0xMare/awesome-autonolas"
          className="text-primary"
        >
          Awesome Autonolas
        </a>{" "}
        repo
      </div>
    </SectionWrapper>
  );
};

export default Services;
