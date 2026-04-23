import { useMemo } from 'react';

type SectionWrapperProps = {
  backgroundType?: 'SUBTLE_GRADIENT' | 'GRAY' | 'GRAY_GRADIENT' | 'GOVERNATOOORR' | 'NONE';
  children: React.ReactNode;
  customClasses?: string;
  id?: string;
  customStyle?: object;
};

const SectionWrapper = ({
  children,
  customClasses = 'px-8 py-12 lg:p-24',
  backgroundType,
  id = '',
  customStyle = null,
}: SectionWrapperProps) => {
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

export default SectionWrapper;
