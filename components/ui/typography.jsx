import { ArrowUpRight } from 'lucide-react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

export const H1 = ({ children, className }) => (
  <h1
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
  >
    {children}
  </h1>
);

H1.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
H1.defaultProps = { className: null };

export const Lead = ({ children, className }) => (
  <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
);

Lead.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
Lead.defaultProps = { className: null };

export const Upcase = ({ children }) => (
  <div className="mb-6 text-lg tracking-widest uppercase text-slate-700">
    {children}
  </div>
);

Upcase.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ExternalLink = ({ children, className, href, hideArrow }) => (
  <a
    className={`inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
    {hideArrow ? null : <ArrowUpRight size={16} />}
  </a>
);

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  hideArrow: PropTypes.bool,
  className: PropTypes.string,
};
ExternalLink.defaultProps = { className: null, hideArrow: false };

export const Link = ({ children, className, href }) => (
  <NextLink
    className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
  >
    {children}
  </NextLink>
);

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
};
Link.defaultProps = { className: null };
