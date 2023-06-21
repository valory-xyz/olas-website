import React, { useMemo } from 'react';

const SectionWrapper = ({ children, customClasses = "p-24", backgroundType }) => {
  const returnBackgroundType = useMemo(() => {
    switch (backgroundType) {
      case 'SUBTLE_GRADIENT':
        return 'w-full h-full bg-gradient-to-r from-purple-100 via-white to-blue-50';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  }, [backgroundType]);

  return (
    <section className={`${customClasses} ${returnBackgroundType}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
