/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';

const SectionHeading = ({
  children,
  size,
  color,
  spacing,
  display,
  weight,
  other,
}) => (
  <h2
    className={`text-3xl lg:text-[40px] ${size} ${spacing} ${color} ${display} ${weight} ${other}`}
  >
    {children}
  </h2>
);

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  display: PropTypes.string,
  size: PropTypes.string,
  spacing: PropTypes.string,
  weight: PropTypes.string,
  other: PropTypes.string,
};

SectionHeading.defaultProps = {
  color: 'text-gray-700',
  display: '',
  size: '',
  spacing: 'mb-12',
  weight: 'font-semibold',
  other: '',
};

export default SectionHeading;
