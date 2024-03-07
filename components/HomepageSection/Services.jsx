import PropTypes from 'prop-types';
import React from 'react';
import Image from 'next/image';
import kits from 'data/kits.json';
import { TEXT } from 'styles/globals';
import Link from 'next/link';
import services from '@/data/services.json';
import serviceCategories from '@/data/serviceCategories.json';
import core from '@/data/core.json';
import chains from '@/data/chains.json';
import builders from '@/data/builders.json';
import SectionWrapper from '@/components/Layout/SectionWrapper';
import SectionHeading from '../SectionHeading';
import ServiceCategoryCard from './ServiceCategoryCard';

const Item = ({ service, category }) => (
  <a
    className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring"
    href={service.url}
  >
    <SectionWrapper
      customClasses="rounded-t-xl border-t-0 border-b"
    >
      <div className="w-full h-[200px] flex">
        <Image
          src={`/images/${category}/${service.iconFilename}`}
          alt={service.name}
          width={300}
          height={300}
          className="mx-auto p-2 my-auto"
        />
      </div>
    </SectionWrapper>
    <div className="p-4 md:p-6 lg:p-4">
      <h2 className="font-bold text-xl text-gray-700">
        {service.name}
      </h2>
    </div>
    {service.description && (
    <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
      {service.description}
    </p>
    )}
  </a>
);

Item.propTypes = {
  category: PropTypes.string.isRequired,
  service: PropTypes.shape({
    description: PropTypes.string,
    iconFilename: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

const KitCard = ({ kit }) => (
  <Link
    className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring"
    href={`/kits/${kit.id}`}
  >
    <div className="p-6">
      <Image
        src={`/images/kits/${kit.id}kit.svg`}
        alt={kit.title}
        width={100}
        height={100}
        className="mb-6"
      />
      <h2 className="font-bold text-xl text-gray-700">
        {kit.title}
      </h2>
      {kit.description && (
      <div className={TEXT}>
        {kit.description}
      </div>
      )}
    </div>
  </Link>
);

KitCard.propTypes = {
  kit: PropTypes.shape({
    description: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

const CoreSubsection = () => (
  <SectionWrapper id="core">
    <div className="mb-12 mx-auto">
      <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
        <div>
          <h2 className="text-3xl font-bold">
            Core
          </h2>

          <p className="mt-4 text-xl md:text-3xl lg:text-xl text-gray-600">
            Olas&apos; key modules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {core.map((item) => (
            <div key={item.id}>
              <Item service={item} category="core" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const ServicesSubsection = () => (
  <SectionWrapper id="services">
    <div className="max-w-screen-xl mb-12 mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Services
          </h2>

          <div className="grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {serviceCategories.map((serviceCategory) => (
              <ServiceCategoryCard
                serviceCategory={serviceCategory}
                services={services}
                key={serviceCategory.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const KitsSubsection = () => (
  <SectionWrapper id="kits">
    <div className="max-w-screen-xl mb-12 mx-auto">
      <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Kits
          </h2>

          <p className={`${TEXT} mb-4`}>
            Olas builders have created a suite of kits to help you get started
            building agents and services.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 xl:grid-cols-4">
            {kits.map((kit) => (
              <KitCard
                kit={kit}
                key={kit.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const ChainsSubsection = () => (
  <SectionWrapper id="chains">
    <div className="max-w-screen-xl mb-12 mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Chains
          </h2>

          <p className="mt-4 text-xl font-light md:text-3xl lg:text-xl text-gray-600 max-w-[700px]">
            Olas Protocol is available on a growing list of chains. When Olas
            Protocol is deployed on a chain, it brings the power of Olas to
            that chain&apos;s ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {chains.map((chain) => (
            <div key={chain.id}>
              <Item service={chain} category="chains" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const BuildersSubsection = () => (
  <SectionWrapper id="builders">
    <div className="max-w-screen-xl mb-12 mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Builders
          </h2>

          <p className="mt-4 text-xl font-light md:text-3xl lg:text-xl text-gray-600 max-w-[700px]">
            Olas has a growing ecosystem of talented developer organizations, pushing
            the autonomous edge every day, building autonomous agents and services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {builders.map((builder) => (
            <div key={builder.id} className="grayscale">
              <Item service={builder} category="builders" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const Services = () => (
  <SectionWrapper id="ecosystem">
    <div className="text-center">
      <SectionHeading spacing="mb-6" color="text-purple-950">
        Already making waves
      </SectionHeading>
      <div className="text-xl font-light text-gray-600 mx-auto mb-12 lg:w-2/4">
        Olas&apos; core protocol is live. Many services are in production and
        being used by an emerging app ecosystem.
      </div>
    </div>
    <CoreSubsection />
    <ServicesSubsection />
    <KitsSubsection />
    <ChainsSubsection />
    <BuildersSubsection />
  </SectionWrapper>
);

export default Services;
