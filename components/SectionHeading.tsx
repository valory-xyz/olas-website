type SectionHeadingProps = {
  children: React.ReactNode;
  color?: string;
  display?: string;
  size?: string;
  spacing?: string;
  weight?: string;
  other?: string;
};

const SectionHeading = ({
  children,
  size = '',
  color = 'text-gray-700',
  spacing = 'mb-12',
  display = '',
  weight = 'font-semibold',
  other = '',
}: SectionHeadingProps) => (
  <h2
    className={`text-3xl lg:text-[40px] ${size} ${spacing} ${color} ${display} ${weight} ${other}`}
  >
    {children}
  </h2>
);

export default SectionHeading;
