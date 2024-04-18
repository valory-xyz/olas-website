import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import useCases from 'data/useCases.json';
import SectionHeading from '../SectionHeading';

const UseCaseCard = ({
  title, image, description, services, className,
}) => (
  <div className={className}>
    <div className="p-8 grid gap-4 md:grid-rows-[140px_88px_144px_32px] lg:grid-rows-[140px_88px_94px_32px]">
      <div className="flex h-[140px] w-[180px] mx-auto">
        <Image
          alt={title}
          src={image}
          width={180}
          height={140}
          className="object-contain"
        />
      </div>
      <h3 className="max-w-[200px] mx-auto text-3xl font-bold mb-4">{title}</h3>
      <p className="text-lg ld:text-xl">{description}</p>
      <h4 className="italic mb-2">
        {services.length > 1 ? 'Examples' : 'Example'}
      </h4>
      {services.map((service) => (
        <div className="flex gap-4 text-start" key={service.title}>
          <Image
            alt={service.title}
            src={service.image}
            width={70}
            height={70}
            className="object-contain"
          />
          <div>
            {service.link ? (
              <Link
                href={service.link}
                className="text-link font-bold underline underline-offset-2"
              >
                {service.title}
              </Link>
            ) : (
              <h5 className="font-bold">{service.title}</h5>
            )}
            <p>{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

UseCaseCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  services: PropTypes.arrayOf({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
  className: PropTypes.string.isRequired,
};

const UseCases = () => (
  <SectionWrapper customClasses="text-center py-24 px-4 border-b">
    <div className="max-w-[440px] mx-auto">
      <SectionHeading color="text-gray-900">
        See some live use cases
      </SectionHeading>
    </div>

    <div className="max-w-screen-xl mx-auto p-0 grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-md border-gray-300 shadow-md mb-16">
      {useCases.map((item, index) => (
        <UseCaseCard
          key={item.id}
          className={`${
            index !== useCases.length - 1
              ? 'border-b md:border-r md:border-b-0 border-gray-300'
              : ''
          }`}
          {...item}
        />
      ))}
    </div>

    <div className="grid max-w-screen-xl md:px-12 mx-auto md:gap-16 md:grid-cols-12 items-center">
      <div className="md:col-span-6 md:flex">
        <Image
          alt="Use cases"
          src="/images/use-cases.png"
          width={834}
          height={742}
          className="object-contain"
        />
      </div>

      <div className="md:col-span-6 text-center px-5 md:p-0 md:text-left">
        <h3 className="text-2xl md:text-4xl font-bold mb-4">
          Boundless applicability
        </h3>
        <p className="md:text-xl mb-12">
          The impact of autonomous agent economies is shaping applications and
          products in Web3 and far beyond.
        </p>
        {/* TODO: uncommment when /explore available */}
        {/* <Button variant="outline" size="xl" asChild>
          <Link href="/explore#use-cases">See more use cases</Link>
        </Button> */}
      </div>
    </div>
  </SectionWrapper>
);

export default UseCases;
