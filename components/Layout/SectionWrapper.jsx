/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const SectionWrapper = ({
  children,
  customClasses,
  backgroundType,
  id,
  customStyle,
}) => {
  const backgroundClasses = useMemo(() => {
    switch (backgroundType) {
      case 'SUBTLE_GRADIENT':
        return 'w-full h-full bg-subtle-gradient bg-white';
      case 'GRAY':
        return 'w-full h-full bg-[#F4F7FB]';
      case 'GRAY_GRADIENT':
        return 'w-full h-full bg-gradient-to-t from-[#E7EAF4] to-gray-50';
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
      style={customStyle}
    >
      {children}
    </section>
  );
};

SectionWrapper.propTypes = {
  backgroundType: PropTypes.oneOf([
    'SUBTLE_GRADIENT',
    'GRAY',
    'GRAY_GRADIENT',
    'GOVERNATOOORR',
    'NONE',
  ]),
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
