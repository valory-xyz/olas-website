import { StaleIndicatorProps } from './types';

const formatLocalDate = (timestamp: number | null): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const StaleMetricContent = ({ status }: StaleIndicatorProps) => {
  const sources = [...(status?.indexingErrors || []), ...(status?.fetchErrors || [])];

  return (
    <div className="flex flex-col items-start text-left">
      <p className="text-gray-800">This metric is outdated due to some issues.</p>
      <span>Last successful update: {formatLocalDate(status?.lastValidAt)}</span>
      {sources.length > 0 && (
        <span className="text-xs mt-2">Affected Sources: {sources.join(', ')}</span>
      )}
    </div>
  );
};
