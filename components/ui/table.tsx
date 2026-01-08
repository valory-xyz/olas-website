import { cn } from 'lib/utils';
import { forwardRef } from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
  children?: React.ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref as React.ForwardedRef<HTMLTableElement>}
        className={cn('w-full caption-bottom text-lg', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
);
Table.displayName = 'Table';

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <thead
      ref={ref as React.ForwardedRef<HTMLTableSectionElement>}
      className={cn('[&_tr]:border-b', className)}
      {...props}
    >
      {children}
    </thead>
  ),
);
TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => (
    <tbody
      ref={ref as React.ForwardedRef<HTMLTableSectionElement>}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    >
      {children}
    </tbody>
  ),
);
TableBody.displayName = 'TableBody';

interface TableFooterProps {
  className?: string;
}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref as React.ForwardedRef<HTMLTableSectionElement>}
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  ),
);
TableFooter.displayName = 'TableFooter';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref as React.ForwardedRef<HTMLTableRowElement>}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  ),
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref as React.ForwardedRef<HTMLTableCellElement>}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  ),
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref as React.ForwardedRef<HTMLTableCellElement>}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  ),
);
TableCell.displayName = 'TableCell';

interface TableCaptionProps {
  className?: string;
}

const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref as React.ForwardedRef<HTMLTableCaptionElement>}
      className={cn('mt-4 text-lg text-muted-foreground', className)}
      {...props}
    />
  ),
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
