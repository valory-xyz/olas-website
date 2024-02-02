import React, { useMemo } from 'react';

const SectionWrapper = ({ children, customClasses = "px-8 py-12 lg:p-24", backgroundType, id = "" }) => {
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
    <section className={`${customClasses} ${returnBackgroundType} scroll-mt-[100px]`} id={id}>
      {children}
    </section>
  );
};

export default SectionWrapper;
