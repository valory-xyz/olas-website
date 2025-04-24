import { Card } from 'components/ui/card';
import Image from 'next/image';
import { CARD_BG } from 'styles/globals';

export const ComingSoon = ({ text, className }) => {
  return (
    <Card className={`${CARD_BG} max-h-[250px] p-16 ${className}`}>
      <Image
        alt="Metrics Coming Soon"
        src="/images/metrics.svg"
        height={48}
        width={48}
        className="mb-6 mx-auto"
      />
      <p className="text-slate-500">{text} metrics coming soon.</p>
    </Card>
  );
};
