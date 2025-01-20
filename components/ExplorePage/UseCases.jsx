import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

import SectionWrapper from 'components/Layout/SectionWrapper';
import serviceCategories from 'data/serviceCategories.json';
import servicesData from 'data/services.json';

const servicePath = (service) => service.path || `/services/${service.slug}`;

const NoServicesYet = () => (
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
);

const ServiceCategoryCard = ({ serviceCategory, services }) => {
  /* eslint-disable-next-line max-len */
  const filteredServices = services.filter((service) =>
    service.serviceCategory.includes(serviceCategory.name),
  );

  return (
    <div className="rounded mt-2 border p-4">
      <div className="mb-2">
        <h2 className="font-bold text-xl text-slate-700 align-bottom">
          {serviceCategory.name}
        </h2>
      </div>

      {filteredServices.length === 0 ? (
        <NoServicesYet />
      ) : (
        filteredServices.map((service) => (
          <div key={service.id} className="mb-2 flex items-center">
            <Link href={servicePath(service)}>
              <Image
                src={`/images/services/${service.iconFilename}`}
                width={75}
                height={75}
                alt={`${service.name} icon`}
                className="mr-4 hover:-translate-y-[2px] transition-transform duration-200 ease-in-out"
              />
            </Link>
            <Link
              href={servicePath(service)}
              className="text-purple-800 hover:text-slate-800 text-lg"
            >
              {service.name}
            </Link>
          </div>
        ))
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
    path: PropTypes.string,
  }).isRequired,
};

const UseCases = () => (
  <SectionWrapper
    id="use-cases"
    customClasses="max-sm:px-6 px-16 py-12 lg:py-24 max-w-screen-xl w-full mx-auto"
  >
    <h3 className="text-4xl font-bold mb-8 text-center">Use Cases</h3>

    <div className="grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {serviceCategories.map((serviceCategory) => (
        <ServiceCategoryCard
          key={serviceCategory.id}
          serviceCategory={serviceCategory}
          services={servicesData}
        />
      ))}
    </div>
  </SectionWrapper>
);

export default UseCases;
