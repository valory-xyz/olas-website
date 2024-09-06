/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const SectionWrapper = ({
  children,
  customClasses,
  backgroundType,
  id,
  backgroundImage,
  customStyle,
}) => {
  const backgroundClasses = useMemo(() => {
    switch (backgroundType) {
      case 'SUBTLE_GRADIENT':
        return 'w-full h-full bg-subtle-gradient bg-white';
      case 'GOVERNATOOORR':
        return 'w-full h-full bg-governatooorr bg-size-50 bg-repeat';
        case 'LINEAR_GRADIENT':
          return 'w-full h-full bg-gradient-to-r from-[#FFF0F1] to-white to-70%';
      case 'NONE':
        return 'w-full h-full';
      default:
        return 'bg-white';
    }
  }, [backgroundType]);

  const sectionStyle = useMemo(() => {
    if (customStyle) {
      return customStyle;
    }

    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: backgroundType === 'CONTAIN' ? 'bottom' : 'center',
        backgroundSize: backgroundType === 'CONTAIN' ? 'contain' : 'cover',
      };
    }

    return undefined;
  }, [customStyle]);

  return (
    <section
      className={`${customClasses} ${backgroundClasses} scroll-mt-[100px]`}
      id={id}
      style={sectionStyle}
    >
      {children}
    </section>
  );
};

SectionWrapper.propTypes = {
  backgroundType: PropTypes.oneOf(['SUBTLE_GRADIENT', 'LINEAR_GRADIENT', 'GOVERNATOOORR', 'NONE']),
  backgroundImage: PropTypes.string,
  children: PropTypes.node.isRequired,
  customClasses: PropTypes.string,
  id: PropTypes.string,
  customStyle: PropTypes.object,
};

SectionWrapper.defaultProps = {
  customClasses: 'px-8 py-12 lg:p-24',
  id: '',
  customStyle: null,
};

export default SectionWrapper;
