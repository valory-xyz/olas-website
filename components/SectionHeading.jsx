const SectionHeading = ({ children, size="text-6xl", color = 'text-gray-700', spacing = 'mb-12' }) => (
  <h2 className={`${size} font-manrope tracking-tight lg:text-heading ${spacing} ${color}`}>
    {children}
  </h2>
);

export default SectionHeading;