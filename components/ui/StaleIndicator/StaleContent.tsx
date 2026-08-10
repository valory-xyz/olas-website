import { StaleIndicatorProps } from './types';

const formatLocalDate = (timestamp: number | null): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const StaleMetricContent = ({ status }: StaleIndicatorProps) => {
  const hardErrors = [...(status?.indexingErrors || []), ...(status?.fetchErrors || [])];
  const sources = [...hardErrors, ...(status?.laggingSubgraphs || [])];
  // Lag alone no longer freezes a metric (see mergeWithFallback), so the value shown is
  // live and only slightly behind — saying it is outdated would misrepresent it.
  const isFrozen = hardErrors.length > 0;

  return (
    <div className="flex flex-col items-start text-left">
      <p className="text-gray-800">
        {isFrozen
          ? 'This metric is outdated due to some issues.'
          : 'Some sources are behind the chain, so this may be slightly undercounted.'}
      </p>
      <span>
        {isFrozen ? 'Last successful update: ' : 'Updated: '}
        {formatLocalDate(status?.lastValidAt)}
      </span>
      {sources.length > 0 && (
        <span className="text-xs mt-2">Affected Sources: {sources.join(', ')}</span>
      )}
    </div>
  );
};
