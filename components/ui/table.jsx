import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { cn } from 'lib/utils';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-lg', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';
Table.propTypes = { className: PropTypes.string };
Table.defaultProps = { className: null };

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';
TableHeader.propTypes = { className: PropTypes.string };
TableHeader.defaultProps = { className: null };

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';
TableBody.propTypes = { className: PropTypes.string };
TableBody.defaultProps = { className: null };

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';
TableFooter.propTypes = { className: PropTypes.string };
TableFooter.defaultProps = { className: null };

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';
TableRow.propTypes = { className: PropTypes.string };
TableRow.defaultProps = { className: null };

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';
TableHead.propTypes = { className: PropTypes.string };
TableHead.defaultProps = { className: null };

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';
TableCell.propTypes = { className: PropTypes.string };
TableCell.defaultProps = { className: null };

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-lg text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
TableCaption.propTypes = { className: PropTypes.string };
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
