import { cn } from 'lib/utils';
import { forwardRef } from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card = forwardRef<HTMLElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'rounded-lg border text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
Card.defaultProps = { className: null };

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
CardHeader.defaultProps = { className: null };

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle = forwardRef<HTMLElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  ),
);
CardTitle.displayName = 'CardTitle';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
CardTitle.defaultProps = { className: '' };

interface CardDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

const CardDescription = forwardRef<HTMLElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn('text-lg text-muted-foreground', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
CardDescription.defaultProps = { className: null };

interface CardContentProps {
  children?: React.ReactNode;
  className?: string;
}

const CardContent = forwardRef<HTMLElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
CardContent.defaultProps = { className: null };

interface CardFooterProps {
  children?: React.ReactNode;
  className?: string;
}

const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
CardFooter.defaultProps = { className: null };

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
