import type { Stat } from 'components/ModelsPage/OlasPredictR1/StatsStrip';
import { StatsStrip as StatsStripBase } from 'components/ModelsPage/OlasPredictR1/StatsStrip';

const STATS: Stat[] = [
  { value: '27B', label: 'Total parameters' },
  { value: '67.3%', label: 'Balanced accuracy on 6,824 production requests' },
  {
    value: 'GPT-5.6',
    qualifier: 'within 1.2 points',
    label: 'In balanced accuracy, given the same market evidence',
  },
];

export const StatsStrip = () => <StatsStripBase stats={STATS} />;
