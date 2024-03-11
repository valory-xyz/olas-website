import PropTypes from 'prop-types';
import NextLink from 'next/link';

export const H1 = ({ children, className }) => (
  <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
    {children}
  </h1>
);

H1.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
H1.defaultProps = { className: null };

export const Lead = ({ children, className }) => (
  <p className={`text-xl text-muted-foreground ${className}`}>
    {children}
  </p>
);

Lead.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
Lead.defaultProps = { className: null };

export const Upcase = ({ children }) => (
  <div className="mb-6 text-lg tracking-widest uppercase text-slate-700">{children}</div>
);

Upcase.propTypes = {
  children: PropTypes.element.isRequired,
};

export const ExternalLink = ({ children, className, href }) => (
  <a
    className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
&nbsp;↗
  </a>
);

ExternalLink.propTypes = {
  children: PropTypes.element.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
};
ExternalLink.defaultProps = { className: null };

export const Link = ({ children, className, href }) => (
  <NextLink
    className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
  >
    {children}
  </NextLink>
);

Link.propTypes = {
  children: PropTypes.element.isRequired,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  className: PropTypes.string,
};
Link.defaultProps = { className: null };
