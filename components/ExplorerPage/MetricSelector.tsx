import { cn } from 'lib/utils';

export type ExplorerMetric = {
  key: string;
  label: string;
  /** Formatted headline value, e.g. "658" or "13,256,779". */
  value: string;
  /** Only metrics with a real daily series can drive the heatmap. */
  selectable: boolean;
};

type MetricSelectorProps = {
  metrics: ExplorerMetric[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

/**
 * Headline metric tiles (Figma 20754:3541). Full-width band with top/bottom rules;
 * a centered 872px container with side rails holds four equal tiles divided by
 * hairlines. The active metric carries a 3px purple underline under its value and
 * drives the heatmap. Metrics without a daily series render muted + non-selectable
 * ("Daily series coming soon") rather than faked.
 */
export const MetricSelector = ({
  metrics,
  activeKey,
  onChange,
  className,
}: MetricSelectorProps) => (
  <div className={cn('flex w-full justify-center border-y border-[#e8eaee]', className)}>
    <div className="flex w-full max-w-[872px] border-x border-[#e8eaee]">
      {metrics.map((metric, i) => {
        const isActive = metric.key === activeKey;
        return (
          <button
            key={metric.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={!metric.selectable || undefined}
            title={metric.selectable ? undefined : 'Daily series coming soon'}
            onClick={() => metric.selectable && onChange(metric.key)}
            className={cn(
              'flex flex-1 flex-col items-start justify-center gap-2 p-6 text-left transition-colors',
              i < metrics.length - 1 && 'border-r border-[#e8eaee]',
              metric.selectable ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'
            )}
          >
            <span className="text-[14px] leading-5 tracking-[0.14px] text-[#78879c]">
              {metric.label}
            </span>
            <span className="relative inline-block">
              <span
                className={cn(
                  'text-[32px] font-semibold leading-10',
                  metric.selectable ? 'text-black' : 'text-gray-400'
                )}
              >
                {metric.value}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-full mt-[2px] h-[3px] w-8 rounded-full bg-[#7e22ce]"
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
