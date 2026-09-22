import { cn } from 'lib/utils';
import type { ReactNode } from 'react';

type Stat = {
  value: string;
  qualifier?: string;
  label: ReactNode;
};

const STATS: Stat[] = [
  { value: '14B', label: 'Total parameters' },
  {
    value: '~20%',
    // Break before the model name and keep it whole: its hyphens would otherwise
    // let the browser split it mid-name.
    label: (
      <>
        Lower forecast error than
        <br />
        <span className="whitespace-nowrap">DeepSeek-R1-Distill-Qwen-14B</span>
      </>
    ),
  },
  { value: 'GPT-4.1', qualifier: 'comparable performance', label: 'In a six-week evaluation' },
];

export const StatsStrip = () => (
  <div className="flex w-full justify-center border-b border-[#e8eaee]">
    <dl className="flex w-full max-w-[1095px] flex-col border-x border-[#e8eaee] md:flex-row">
      {STATS.map((stat, i) => (
        <div
          key={stat.value}
          className={cn(
            'flex flex-1 flex-col gap-2 p-6 md:max-w-[365px]',
            // Stacked on mobile → divider along the bottom; row on md+ → divider on the right.
            i < STATS.length - 1 && 'border-b border-[#e8eaee] md:border-b-0 md:border-r'
          )}
        >
          <dt className="order-2 text-[14px] leading-5 tracking-[0.14px] text-[#7d8a9e]">
            {stat.label}
          </dt>
          <dd className="order-1 flex items-baseline gap-x-1.5 text-[32px] font-semibold leading-10 text-black">
            {stat.value}
            {stat.qualifier && (
              // Stays on the value's line: the tile is wide enough at every breakpoint.
              <span className="whitespace-nowrap text-sm font-medium leading-5">
                {stat.qualifier}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
