import { cva } from 'class-variance-authority';
import { cn } from 'lib/utils';
import PropTypes from 'prop-types';

const tagVariants = cva(
  'relative inline-flex items-center justify-center px-3 py-1 font-semibold rounded-md text-center w-full',
  {
    variants: {
      variant: {
        primary: 'bg-[#7E22CE0D] text-[#7E22CE]',
        white: 'bg-[#FFFFFF0D] text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const tagBordersVariants = cva('absolute w-2 h-2', {
  variants: {
    variant: {
      primary: 'border-[#C084FC]',
      white: 'border-[#FFFFFF80]',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const Tag = ({ className, variant, children, ...props }) => {
  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'top-0 left-0 border-t-2 border-l-2',
          )}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'top-0 right-0 border-t-2 border-r-2',
          )}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'bottom-0 left-0 border-b-2 border-l-2',
          )}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'bottom-0 right-0 border-b-2 border-r-2',
          )}
        />
      </div>

      <div className={cn(tagVariants({ variant }))}>{children}</div>
    </div>
  );
};

Tag.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'white']),
  children: PropTypes.node.isRequired,
};

Tag.defaultProps = {
  className: null,
  variant: null,
};
