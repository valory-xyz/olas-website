import PropTypes from 'prop-types';
import React from 'react';
import Image from 'next/image';
import chains from 'data/chains.json';
import SectionWrapper from 'components/Layout/SectionWrapper';

const Item = ({
  name, url, iconFilename,
}) => (
  <a
    className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring"
    href={url}
  >
    <SectionWrapper
      customClasses="rounded-t-xl border-t-0 border-b"
    >
      <div className="flex">
        <Image
          src={`/images/chains/${iconFilename}`}
          alt={name}
          width={300}
          height={300}
          className="mx-auto p-4 my-auto w-full h-[200px] "
        />
      </div>
    </SectionWrapper>
    <div className="p-4 md:p-6 lg:p-4">
      <h2 className="font-bold text-xl text-gray-700">
        {name}
      </h2>
    </div>
  </a>
);

Item.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  iconFilename: PropTypes.string.isRequired,
};

const Chains = () => (
  <SectionWrapper id="chains" customClasses="px-8 max-w-screen-xl w-full mx-auto">
    <h3 className="text-4xl font-bold mb-2">
      Chains
    </h3>

    <p className="mt-4 text-xl font-light md:text-3xl lg:text-xl text-gray-600 max-w-[700px] mb-6">
      Olas Protocol is available on a growing list of chains. When Olas
      Protocol is deployed on a chain, it brings the power of Olas to
      that chain&apos;s ecosystem.
    </p>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {chains.map((chain) => (
        <Item {...chain} key={chain.id} />
      ))}
    </div>
  </SectionWrapper>
);

export default Chains;
