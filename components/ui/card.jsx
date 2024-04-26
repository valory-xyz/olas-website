import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { cn } from 'lib/utils';

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';
Card.propTypes = { className: PropTypes.string };
Card.defaultProps = { className: null };

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';
CardHeader.propTypes = { className: PropTypes.string };
CardHeader.defaultProps = { className: null };

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';
CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
CardTitle.defaultProps = { className: '' };

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-lg text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';
CardDescription.propTypes = { className: PropTypes.string };
CardDescription.defaultProps = { className: null };

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';
CardContent.propTypes = { className: PropTypes.string };
CardContent.defaultProps = { className: null };

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
CardFooter.propTypes = { className: PropTypes.string };
CardFooter.defaultProps = { className: null };

export {
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent,
};
