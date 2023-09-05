import Image from "next/image";

const ServiceCategoryCard = ({ serviceCategory, services }) => {
  const filteredServices = services.filter((service) => {
    return service.infraCategory.includes(serviceCategory.name);
  });

  if (filteredServices.length > 0)
    return (
      <div className="border rounded mt-4">
        <div className="border-b p-4">
            <h2 className="font-bold text-2xl text-slate-700 mb-1 align-bottom">
            <span class="material-symbols-outlined">{serviceCategory.iconName}</span> {serviceCategory.name}
            </h2>
            <div className="text-slate-600 min-h-[45px]">{serviceCategory.description}</div>
          </div>
        <div className="p-4 min-h-[200px]">
          {filteredServices.map((service) => {
            return (
              <div key={service.id} className="mb-2 flex items-center">
                <Image
                  src={`/images/services/${service.iconFilename}`}
                  width={50}
                  height={50}
                  alt={service.name + " icon"}
                  className="mr-2"
                />
                <div>
                  {service.name}
                  <div className="text-slate-500">
                    {service.appUrl && <><a href={service.appUrl} rel="noopener noreferrer" target="_blank">Visit app</a></>}
                    {service.marketingUrl && <> · <a href={service.marketingUrl} rel="noopener noreferrer" target="_blank">Learn more</a></>}
                    {service.buildUrl && <> · <a href={service.buildUrl} rel="noopener noreferrer" target="_blank">Build your own</a></>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
};

export default ServiceCategoryCard;
