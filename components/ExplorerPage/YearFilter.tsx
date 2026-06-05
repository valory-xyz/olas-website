import { cn } from 'lib/utils';

type YearFilterProps = {
  years: number[];
  activeYear: number | null;
  onChange: (year: number) => void;
  className?: string;
};

/**
 * Underline-tab year filter (Figma node 20629:6543). Each year is a tab; the
 * active one carries a 2px × 16px purple-700 (#7e22ce) underline indicator.
 * Selecting a year is the "jump to + highlight that year" control for the heatmap.
 */
export const YearFilter = ({ years, activeYear, onChange, className }: YearFilterProps) => (
  <div
    role="tablist"
    aria-label="Filter by year"
    className={cn('flex items-center gap-1', className)}
  >
    {years.map((year) => {
      const isActive = year === activeYear;
      return (
        <button
          key={year}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(year)}
          className={cn(
            'relative flex items-center justify-center rounded-md px-2 py-1 text-sm text-gray-900 transition-colors',
            !isActive && 'hover:bg-slate-200'
          )}
        >
          {year}
          {isActive && (
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-purple-700"
            />
          )}
        </button>
      );
    })}
  </div>
);
