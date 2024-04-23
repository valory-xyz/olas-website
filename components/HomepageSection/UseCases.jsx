import SectionWrapper from 'components/Layout/SectionWrapper';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import useCases from 'data/useCases.json';
import SectionHeading from '../SectionHeading';

const UseCaseCard = ({
  title, image, imageWidth, description, services, className,
}) => (
  <div className={className}>
    <div className="p-4 grid gap-4 md:grid-rows-[194px_88px_144px_70px] lg:grid-rows-[194px_88px_94px_70px]">
      <div className="flex mx-auto">
        <Image
          alt={title}
          src={image}
          width={imageWidth}
          height={194}
          className="object-contain"
        />
      </div>
      <h3 className="max-w-[200px] mx-auto text-3xl font-bold mb-4">{title}</h3>
      <p className="text-xl text-slate-700">{description}</p>
      <h4 className="flex items-center justify-center w-[106px] h-[38px] bg-gray-100 border-1.5 border-gray-300 text-slate-700 rounded-full mx-auto mb-8">
        Examples
      </h4>
      <div>
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.link}
            {...(service.isExternal
              ? {
                target: '_blank',
                rel: 'noopener noreferrer',
              }
              : {}
          )}
            className="flex gap-4 p-3 text-start hover:bg-gray-100 rounded-lg"
          >
            <Image
              alt={service.title}
              src={service.image}
              width={70}
              height={70}
              className="object-contain"
            />
            <div>
              <h5 className="font-bold">
                {service.title}
                {' '}
                {service.isExternal
                  ? <span className="font-normal text-purple-800"> ↗</span> : ''}
              </h5>
              <p className="text-slate-700 mt-1">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

UseCaseCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  services: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
  })).isRequired,
  className: PropTypes.string.isRequired,
};

const UseCases = () => (
  <SectionWrapper customClasses="text-center py-24 px-4 border-b">
    <SectionHeading color="text-gray-900" size="text-4xl md:text-6xl">
      Live use cases, creating value today
    </SectionHeading>

    <div className="max-w-screen-xl mx-auto p-0 grid grid-cols-1 md:grid-cols-3 gap-0 mb-20">
      {useCases.map((item, index) => (
        <UseCaseCard
          key={item.id}
          className={`${
            index !== useCases.length - 1
              ? 'border-b-1.5 md:border-r-1.5 md:border-b-0 border-gray-300'
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
          Expanding what&apos;s possible
        </h3>
        <p className="md:text-xl mb-12">
          The impact of autonomous agent economies is shaping applications and
          products in Web3 and far beyond.
        </p>
        {/* TODO: uncomment when /explore available */}
        {/* <Button variant="outline" size="xl" asChild>
          <Link href="/explore#use-cases">See more use cases</Link>
        </Button> */}
      </div>
    </div>
  </SectionWrapper>
);

export default UseCases;
