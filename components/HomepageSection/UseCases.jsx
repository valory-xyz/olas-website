import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

import useCases from 'data/useCases.json';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import SectionHeading from '../SectionHeading';

const UseCaseCard = ({
  title,
  image,
  imageWidth,
  description,
  services,
  className,
}) => (
  <div className={className}>
    <div className="py-12 md:p-4 grid gap-4 md:grid-rows-[194px_88px_144px_70px] lg:grid-rows-[194px_88px_94px_70px]">
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
              : {})}
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
                {service.title}{' '}
                {service.isExternal ? (
                  <span className="font-normal text-purple-800"> ↗</span>
                ) : (
                  ''
                )}
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
  services: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
    }),
  ).isRequired,
  className: PropTypes.string.isRequired,
};

const UseCases = () => (
  <SectionWrapper customClasses="text-center pt-24 md:py-24 px-4">
    <SectionHeading color="text-gray-900" weight="font-bold">
      Live use cases, creating value today
    </SectionHeading>

    <div className="max-w-screen-xl mx-auto p-0 grid grid-cols-1 md:grid-cols-3 gap-0">
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

    <div>
      <Button
        variant="outline"
        size="xl"
        asChild
        className="mt-12 max-sm:mt-3 col-start-2 mx-auto"
      >
        <Link href="/explore">See more use cases</Link>
      </Button>
    </div>
  </SectionWrapper>
);

export default UseCases;
