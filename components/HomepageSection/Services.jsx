import React from "react";
import Image from "next/image";
import services from "@/data/services.json";
import core from "@/data/core.json";
import apps from "@/data/apps.json";
import Badge from "../Badge";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const Item = ({ service, category }) => {
  return (
    <a
      className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring"
      href={service.url}
    >
      <SectionWrapper customClasses="rounded-t-xl border-t-0" backgroundType="SUBTLE_GRADIENT">
        <Image
          src={`/images/${category}/${service.iconFilename}`}
          alt={service.name}
          width={450}
          height={200}
          className="mx-auto p-2"
        />
      </SectionWrapper>
      <div className="p-4 md:p-6 lg:p-4">
        <h2 className="mb-2 font-bold text-2xl text-gray-700">{service.name}</h2>

        {service?.tags?.length > 0 &&
          service.tags.map((tag) => {
            return (
              <div key={service.id + tag}>
                <Badge>{tag}</Badge>
              </div>
            );
          })}
      </div>
      {service.description && (
        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          {service.description}
        </p>
      )}
    </a>
  );
};

const CoreSubsection = () => {
  return (
    <section className="bg-grey">
      <div className="max-w-screen-xl mb-12">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-gray-600 leading-normal">Core</h2>

            <p className="mt-4 text-xl md:text-3xl lg:text-xl text-gray-600">
              Olas&apos; key modules.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {core.map((core) => {
              return (
                <div key={core.id}>
                  <Item service={core} category="core" />
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
            <h2 className="text-3xl font-light tracking-tight text-gray-600 leading-normal">Services</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {services.map((service) => {
              return (
                <div key={service.id}>
                  <Item service={service} category="services" />
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
            <h2 className="text-3xl font-light tracking-tight text-gray-600 leading-normal">Apps</h2>

            <p className="mt-4 text-xl md:text-3xl lg:text-xl text-gray-600">
              There is already a growing ecosystem of apps built on Olas,
              consuming infra services.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {apps.map((app) => {
              return (
                <div key={app.id}>
                  <Item service={app} category="apps" />
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
        <SectionHeading color="text-purple-950">
          Already making waves
        </SectionHeading>
        <div className="text-2xl md:text-3xl mx-auto text-gray-600 mb-12 lg:w-[55ch]">
          Olas&apos; core protocol is live. Many services are in production and
          being used by an emerging app ecosystem.
        </div>
      </div>
      <CoreSubsection />
      <ServicesSubsection />
      <AppsSubsection />
      <div className="text-center text-2xl md:text-3xl lg:text-2xl text-gray-600">
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
