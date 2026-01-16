import { cva } from 'class-variance-authority';
import { cn } from 'lib/utils';

const tagVariants = cva(
  'relative inline-flex items-center justify-center px-3 py-1 font-semibold rounded-md text-center w-full',
  {
    variants: {
      variant: {
        primary: 'bg-[#7E22CE0D] text-[#7E22CE]',
        secondary: 'bg-[#F4F7FB] text-black',
        tertiary: 'bg-[#00998C0D] text-black',
        white: 'bg-[#FFFFFF0D] text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const tagBordersVariants = cva('absolute w-2 h-2', {
  variants: {
    variant: {
      primary: 'border-[#C084FC]',
      secondary: 'border-[#A3AEBB]',
      tertiary: 'border-[#00998C99]',
      white: 'border-[#FFFFFF80]',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type TagProps = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'white';
  children: React.ReactNode;
};

export const Tag = ({ className, variant, children, ...props }: TagProps) => {
  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(tagBordersVariants({ variant }), 'top-0 left-0 border-t-2 border-l-2 z-20')}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'top-0 right-0 border-t-2 border-r-2 z-20'
          )}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'bottom-0 left-0 border-b-2 border-l-2 z-20'
          )}
        />
        <div
          className={cn(
            tagBordersVariants({ variant }),
            'bottom-0 right-0 border-b-2 border-r-2 z-20'
          )}
        />
      </div>

      <div className={cn(tagVariants({ variant }), 'z-10')}>{children}</div>
    </div>
  );
};

Tag.defaultProps = {
  className: null,
  variant: null,
};
