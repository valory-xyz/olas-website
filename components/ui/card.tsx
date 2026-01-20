import { cn } from 'lib/utils';
import { forwardRef } from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
};

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref as React.ForwardedRef<HTMLDivElement>}
    className={cn('rounded-lg border text-card-foreground shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

type CardHeaderProps = {
  children?: React.ReactNode;
  className?: string;
};

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref as React.ForwardedRef<HTMLDivElement>}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref as React.ForwardedRef<HTMLHeadingElement>}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

type CardDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
};

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref as React.ForwardedRef<HTMLParagraphElement>}
      className={cn('text-lg text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

type CardContentProps = {
  children?: React.ReactNode;
  className?: string;
};

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div
    ref={ref as React.ForwardedRef<HTMLDivElement>}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

type CardFooterProps = {
  children?: React.ReactNode;
  className?: string;
};

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref as React.ForwardedRef<HTMLDivElement>}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
