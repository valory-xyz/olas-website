import React, { useMemo } from 'react';

const SectionWrapper = ({ children, customClasses = "px-8 py-12 lg:p-24", backgroundType }) => {
  const returnBackgroundType = useMemo(() => {
    switch (backgroundType) {
      case 'SUBTLE_GRADIENT':
        return 'w-full h-full bg-subtle-gradient bg-white';
      case 'GOVERNATOOORR':
        return 'w-full h-full bg-governatooorr bg-size-50 bg-repeat';
      default:
        return 'bg-white';
    }
  }, [backgroundType]);

  return (
    <section className={`${customClasses} ${returnBackgroundType}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
