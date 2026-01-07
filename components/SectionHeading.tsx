interface SectionHeadingProps {
  children: React.ReactNode;
  color?: string;
  display?: string;
  size?: string;
  spacing?: string;
  weight?: string;
  other?: string;
}

const SectionHeading = ({
  children,
  size,
  color,
  spacing,
  display,
  weight,
  other,
}: SectionHeadingProps) => (
  <h2
    className={`text-3xl lg:text-[40px] ${size} ${spacing} ${color} ${display} ${weight} ${other}`}
  >
    {children}
  </h2>
);

SectionHeading.defaultProps = {
  color: 'text-gray-700',
  display: '',
  size: '',
  spacing: 'mb-12',
  weight: 'font-semibold',
  other: '',
};

export default SectionHeading;
