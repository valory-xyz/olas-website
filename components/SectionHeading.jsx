import PropTypes from 'prop-types';

const SectionHeading = ({
  children, size, color, spacing, display, weight, other,
}) => (
  <h2 className={`${size} tracking-tight lg:text-heading ${spacing} ${color} ${display} ${weight} ${other}`}>
    {children}
  </h2>
);

SectionHeading.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.string,
  display: PropTypes.string,
  size: PropTypes.string,
  spacing: PropTypes.string,
};

SectionHeading.defaultProps = {
  color: 'text-gray-700',
  display: '',
  size: 'text-6xl',
  spacing: 'mb-12',
};

export default SectionHeading;
