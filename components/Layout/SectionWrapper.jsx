import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { cn } from 'lib/utils';

const SectionWrapper = ({
  children, customClasses = 'px-8 py-12 lg:p-24', backgroundType, id = '',
}) => {
  const returnBackgroundType = useMemo(() => {
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
    <section className={cn(customClasses, returnBackgroundType, 'scroll-mt-[100px]')} id={id}>
      {children}
    </section>
  );
};

SectionWrapper.propTypes = {
  backgroundType: PropTypes.string,
  children: PropTypes.element.isRequired,
  customClasses: PropTypes.string,
  id: PropTypes.string,
};
SectionWrapper.defaultProps = {
  backgroundType: undefined,
  customClasses: 'px-8 py-12 lg:p-24',
  id: '',
};
export default SectionWrapper;
