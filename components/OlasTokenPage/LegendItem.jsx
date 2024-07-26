import PropTypes from 'prop-types';

export const LegendItem = ({ color, label }) => (
  <div className="flex gap-2 items-center">
    <div className={`${color} px-3 py-1 rounded-sm`} />
    <span className="text-sm">{label}</span>
  </div>
);

LegendItem.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
