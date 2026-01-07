import { forwardRef } from 'react';
import { cn } from 'lib/utils';

interface TableProps {
  className?: string;
}

const Table = forwardRef<HTMLElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
        ref={ref}
        className={cn('w-full caption-bottom text-lg', className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = 'Table';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
Table.defaultProps = { className: null };

interface TableHeaderProps {
  className?: string;
}

const TableHeader = forwardRef<HTMLElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableHeader.defaultProps = { className: null };

interface TableBodyProps {
  className?: string;
}

const TableBody = forwardRef<HTMLElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  ),
);
TableBody.displayName = 'TableBody';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableBody.defaultProps = { className: null };

interface TableFooterProps {
  className?: string;
}

const TableFooter = forwardRef<HTMLElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  ),
);
TableFooter.displayName = 'TableFooter';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableFooter.defaultProps = { className: null };

interface TableRowProps {
  className?: string;
}

const TableRow = forwardRef<HTMLElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableRow.defaultProps = { className: null };

interface TableHeadProps {
  className?: string;
}

const TableHead = forwardRef<HTMLElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableHead.defaultProps = { className: null };

interface TableCellProps {
  className?: string;
}

const TableCell = forwardRef<HTMLElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      // @ts-expect-error TS(2322) FIXME: Type 'ForwardedRef<HTMLElement>' is not assignable... Remove this comment to see the full error message
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableCell.defaultProps = { className: null };

interface TableCaptionProps {
  className?: string;
}

const TableCaption = forwardRef<HTMLElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-lg text-muted-foreground', className)}
      {...props}
    />
  ),
);
TableCaption.displayName = 'TableCaption';

// @ts-expect-error TS(2339) FIXME: Property 'defaultProps' does not exist on type 'Fo... Remove this comment to see the full error message
TableCaption.defaultProps = { className: null };

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
