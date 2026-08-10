import { isFrozen } from 'common-util/graphql/metric-utils';
import { StaleIndicatorProps } from './types';

const formatLocalDate = (timestamp: number | null): string => {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const StaleMetricContent = ({ status }: StaleIndicatorProps) => {
  // Must be the shared predicate, not a local recompute: `frozen` is reachable with empty
  // error arrays (a transform returning null freezes on the nil value alone), and a local
  // `hardErrors.length > 0` would then promise live data under a greyed, held-over number.
  const frozen = isFrozen(status);
  const sources = [
    ...(status?.indexingErrors || []),
    ...(status?.fetchErrors || []),
    ...(status?.laggingSubgraphs || []),
  ];

  return (
    <div className="flex flex-col items-start text-left">
      <p className="text-gray-800">
        {frozen
          ? 'This metric is outdated due to some issues.'
          : 'Some sources are behind the chain, so this may be slightly undercounted.'}
      </p>
      <span>
        {frozen ? 'Last successful update: ' : 'Updated: '}
        {formatLocalDate(status?.lastValidAt)}
      </span>
      {sources.length > 0 && (
        <span className="text-xs mt-2">Affected Sources: {sources.join(', ')}</span>
      )}
    </div>
  );
};
