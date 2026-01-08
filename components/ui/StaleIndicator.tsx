import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

type MetricStatus = {
  stale: boolean;
  lastValidAt: number | null;
  indexingErrors: string[];
  fetchErrors: string[];
};

type StaleIndicatorProps = {
  status: MetricStatus | undefined;
};

const formatLocalDate = (timestamp: number | null): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const StaleMetricContent = ({ status }: StaleIndicatorProps) => (
  <div className="flex flex-col">
    <p className="text-gray-800">This metric is outdated due to some issues.</p>
    <span>Last successful update: {formatLocalDate(status.lastValidAt)}</span>
  </div>
);

export const StaleIndicator = ({ status }: StaleIndicatorProps) => {
  if (!status?.stale) return null;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger className="text-amber-500 inline-flex items-center">
          <Info size={20} />
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          className="p-2 text-sm bg-white border rounded-lg shadow-lg max-w-[320px] z-50"
        >
          <StaleMetricContent status={status} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
