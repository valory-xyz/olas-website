import Image from 'next/image';
import Link from 'next/link';
import services from '../../data/services.json';

// This component is not yet used but will likely be useful in the future
const ServicesTable = () => (
  <div className="overflow-x-auto border rounded-lg">
    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-left">
      <thead>
        <tr>
          <th className="w-[150px]" />
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            Name
          </th>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            Infra Category
          </th>
          <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
            App Category
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {services
          .sort((a, b) => a.serviceCategory.localeCompare(b.serviceCategory))
          .map((service) => (
            <tr key={service.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                <Image
                  src={`/images/services/${service.iconFilename}`}
                  width={75}
                  height={75}
                  alt={`${service.name} icon`}
                />
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                <Link href={`/services/${service.id}`}>{service.name}</Link>
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {service.serviceCategory}
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {service.appCategory}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default ServicesTable;
