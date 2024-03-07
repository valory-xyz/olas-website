import Image from 'next/image';

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

export default ServiceCategoryCard;
