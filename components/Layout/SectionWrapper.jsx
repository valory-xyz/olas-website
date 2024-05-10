/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const SectionWrapper = ({
  children,
  customClasses,
  backgroundType,
  id,
  backgroundImage,
}) => {
  const backgroundClasses = useMemo(() => {
    switch (backgroundType) {
      case 'SUBTLE_GRADIENT':
        return 'w-full h-full bg-subtle-gradient bg-white';
      case 'GOVERNATOOORR':
        return 'w-full h-full bg-governatooorr bg-size-50 bg-repeat';
      case 'NONE':
        return 'w-full h-full';
      default:
        return 'bg-white';
    }
  }, [backgroundType]);

  return (
    <section
      className={`${customClasses} ${backgroundClasses} scroll-mt-[100px]`}
      id={id}
      style={
        backgroundImage
          ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition:
                backgroundType === 'CONTAIN' ? 'bottom' : 'center',
            backgroundSize:
                backgroundType === 'CONTAIN' ? 'contain' : 'cover',
          }
          : undefined
      }
    >
      {children}
    </section>
  );
};

SectionWrapper.propTypes = {
  backgroundType: PropTypes.string,
  backgroundImage: PropTypes.string,
  children: PropTypes.node.isRequired,
  customClasses: PropTypes.string,
  id: PropTypes.string,
};
SectionWrapper.defaultProps = {
  customClasses: 'px-8 py-12 lg:p-24',
  id: '',
};
export default SectionWrapper;
