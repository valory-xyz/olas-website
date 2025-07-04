import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { cn } from 'lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-purple-600 text-purple-50 shadow hover:bg-purple-900/90 dark:bg-purple-50 dark:text-purple-900 dark:hover:bg-purple-50/90',
        destructive:
          'bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        outline:
          'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        secondary:
          'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        ghostPrimary:
          'hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-800 dark:hover:text-purple-50 border border-purple-600 text-purple-600',
        link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
        valory:
          'border hover:bg-valory-green hover:text-black hover:border-valory-green',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-md px-4 text-lg lg:px-12',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

Button.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'xl', 'icon']),
  variant: PropTypes.oneOf([
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'ghostPrimary',
    'link',
    'valory',
  ]),
};

Button.defaultProps = {
  asChild: false,
  className: null,
  size: 'default',
  variant: 'default',
};

export { Button, buttonVariants };
