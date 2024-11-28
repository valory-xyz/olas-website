import PropTypes from 'prop-types';

export const Spinner = ({ customClass = 'h-screen' }) => (
  <div className={`flex items-center justify-center ${customClass}`}>
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-900" />
  </div>
);

Spinner.propTypes = {
  customClass: PropTypes.string,
};

Spinner.defaultProps = {
  customClass: 'h-screen',
};
