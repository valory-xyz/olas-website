import SectionWrapper from 'components/Layout/SectionWrapper';
import { MetricsCard } from 'components/MetricsCard';
import { CTA_LINK } from './utils';

const contributeData = [
  {
    role: 'contribute',
    displayMetrics: [
      {
        key: 'totalContribute',
        imageSrc: 'contributors.png',
        labelText: 'Total Olas Contributors',
        source: CTA_LINK,
        metric: 320,
      },
      {
        key: 'DailyContribute',
        imageSrc: 'DAC.png',
        imageWidth: 72,
        labelText: 'Daily Active Contributors',
        source: 'https://operate.olas.network/contracts',
        metric: 13,
      },
    ],
  },
];

export const ContributeMetrics = () => {
  return (
    <SectionWrapper customClasses="border-b-1.5 py-16">
      {contributeData.map((data, index) => (
        <MetricsCard key={index} metrics={data} />
      ))}
    </SectionWrapper>
  );
};
