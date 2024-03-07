import PropTypes from 'prop-types';

const Verify = ({ url }) => (
  <a
    href={url}
    className="text-slate-400 underline underline-offset-4"
    rel="noopener noreferrer"
    target="_blank"
  >
    Verify ↗
  </a>
);

Verify.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Verify;
