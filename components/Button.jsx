import PropTypes from 'prop-types';
import Link from 'next/link';

const getPrimaryStyle = (isHoverEnabled, disabled) => `
  bg-purple-900
  text-white
  border-primary
  focus:ring-gray-100
  ${isHoverEnabled && !disabled ? 'hover:bg-white hover:text-purple-900' : ''}
`;

const secondaryStyle = 'bg-white text-primary border-primary hover:bg-purple-900 hover:text-white focus:ring-gray-100';

const sizeLgStyle = 'px-6 py-4 text-xl sm:text-base sm:px-8 sm:py-5 lg:text-xl lg:px-6 lg:py-4 rounded-lg';

const sizeMdStyle = 'px-3 py-2 text-lg lg:text-lg lg:px-3 lg:py-2 rounded-md';

const disabledStyle = 'text-gray-500 border-gray-300 bg-white cursor-not-allowed';

/**
 *
 * @deprecated This component is deprecated and use components/ui/button.jsx instead.
 */
export function Button({
  href,
  className,
  size,
  isExternal,
  shouldInvertOnHover,
  type,
  ...props
}) {
  const fullClassName = `
    inline-flex
    items-center
    text-center
    justify-center
    border
    focus:ring-4
    ${props.disabled && disabledStyle}
    ${type === 'primary' && getPrimaryStyle(shouldInvertOnHover, props.disabled)}
    ${type === 'secondary' && secondaryStyle}
    ${size === 'lg' && sizeLgStyle}
    ${size === 'md' && sizeMdStyle}
    ${className}`;

  return href ? (
    <Link
      href={href}
      className={fullClassName}
      rel={isExternal && 'noopener noreferrer'}
      target={isExternal && '_blank'}
      disabled={props.disabled}
      {...props}
    />
  ) : (
    <button type="button" className={fullClassName} {...props} />
  );
}

Button.propTypes = {
  className: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  isExternal: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  shouldInvertOnHover: PropTypes.bool,
};
Button.defaultProps = {
  className: null,
  isExternal: false,
  size: 'lg',
  type: 'primary',
  disabled: false,
  shouldInvertOnHover: true,
};
