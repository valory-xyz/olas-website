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
      className="block rounded-xl border border-gray-200 shadow-sm hover:border-gray-200 hover:shadow-lg focus:outline-none focus:ring"
      href={service.url}
    >
      <Image
        src={`/images/${category}/${service.iconFilename}`}
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

      </div>
        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          {service.description}
        </p>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <h2 className="text-paragraph">Services</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <h2 className="text-paragraph">Apps</h2>

            <p className="mt-4 text-xl text-gray-600">
              There is already a growing ecosystem of apps built on Olas,
              consuming infra services.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <SectionHeading color="text-purple-950">Already making waves</SectionHeading>
        <div className="text-2xl mx-auto text-gray-600 mb-12 lg:w-[55ch]">Olas&apos; core protocol is live. Many services are in production and being used by an emerging app ecosystem.</div>
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
