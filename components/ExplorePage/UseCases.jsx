import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import servicesData from 'data/services.json';
import serviceCategories from 'data/serviceCategories.json';
import SectionWrapper from 'components/Layout/SectionWrapper';

const servicePath = (service) => `/services/${service.slug}`;

const ServiceCategoryCard = ({ serviceCategory, services }) => {
  const filteredServices = services.filter(
    (service) => service.serviceCategory.includes(serviceCategory.name),
  );

  return (
    <div className="rounded mt-2 border p-4">
      <div className="mb-2">
        <h2 className="font-bold text-xl text-slate-700 align-bottom">
          {serviceCategory.name}
        </h2>
      </div>
      {filteredServices.length > 0 ? (
        <div>
          {filteredServices.map((service) => (
            <div key={service.id} className="mb-2 flex items-center">
              <a
                href={servicePath(service)}
              >
                <Image
                  src={`/images/services/${service.iconFilename}`}
                  width={75}
                  height={75}
                  alt={`${service.name} icon`}
                  className="mr-4 hover:-translate-y-[2px] transition-transform duration-200 ease-in-out"
                />
              </a>
              <div>
                <div className="mb-1">
                  <a
                    href={servicePath(service)}
                    className="text-purple-800 hover:text-slate-800 text-lg"
                  >
                    {service.name}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-2 flex items-center">
          <Image
            src="/images/services/empty.svg"
            width={75}
            height={75}
            alt="No services yet"
            className="mr-4"
          />
          <div className="text-slate-400">No services yet</div>
        </div>
      )}
    </div>
  );
};

ServiceCategoryCard.propTypes = {
  serviceCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  services: PropTypes.arrayOf({
    id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    serviceCategory: PropTypes.string,
    description: PropTypes.string,
    appUrl: PropTypes.string,
    marketingUrl: PropTypes.string,
    buildUrl: PropTypes.string,
    iconFilename: PropTypes.string,
    demo: PropTypes.bool,
    builder: PropTypes.string,
  }).isRequired,
};

const UseCases = () => (
  <SectionWrapper id="use-cases" customClasses="px-8 max-w-screen-xl w-full mx-auto">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
      <h3 className="text-4xl font-bold mb-2">
        Use cases
      </h3>

      <div className="grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {serviceCategories.map((serviceCategory) => (
          <ServiceCategoryCard
            serviceCategory={serviceCategory}
            services={servicesData}
            key={serviceCategory.id}
          />
        ))}
      </div>
    </div>
  </SectionWrapper>
);

export default UseCases;
