import { cn } from 'lib/utils';

type Stat = {
  value: string;
  qualifier?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: '14B', label: 'Total parameters' },
  { value: '~20%', label: 'Lower forecast error than DeepSeek-R1-Distill-Qwen-14B' },
  { value: 'GPT-4.1', qualifier: 'comparable performance', label: 'In a six-week evaluation' },
];

export const StatsStrip = () => (
  <div className="flex w-full justify-center border-b border-[#e8eaee]">
    <dl className="flex w-full max-w-[1095px] flex-col border-x border-[#e8eaee] md:flex-row">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-1 flex-col gap-2 p-6 md:max-w-[365px]',
            // Stacked on mobile → divider along the bottom; row on md+ → divider on the right.
            i < STATS.length - 1 && 'border-b border-[#e8eaee] md:border-b-0 md:border-r'
          )}
        >
          <dt className="order-2 text-[14px] leading-5 tracking-[0.14px] text-[#7d8a9e]">
            {stat.label}
          </dt>
          <dd className="order-1 flex flex-wrap items-baseline gap-x-1.5 text-[32px] font-semibold leading-10 text-black">
            {stat.value}
            {stat.qualifier && (
              // Wraps as a unit under the value on narrow tiles, never mid-phrase.
              <span className="whitespace-nowrap text-base font-medium leading-6">
                {stat.qualifier}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
