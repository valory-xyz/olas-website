import PropTypes from 'prop-types';

export const ExternalLink = ({ href, children, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`${className} text-purple-600 cursor-pointer `}
  >
    {children}
  </a>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ExternalLink.defaultProps = {
  className: '',
};
