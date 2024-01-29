const SectionHeading = ({ children, size="text-6xl", color = 'text-gray-700', spacing = 'mb-12', display = "" }) => (
  <h2 className={`${size} tracking-tight lg:text-heading ${spacing} ${color} ${display}`}>
    {children}
  </h2>
);

export default SectionHeading;