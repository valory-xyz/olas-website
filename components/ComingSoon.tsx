import { Card } from 'components/ui/card';
import { Bot } from 'lucide-react';
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

export const AgentsComingSoon = ({ description }) => (
  <Card className="p-8 border border-slate-200 rounded-full text-xl w-full rounded-2xl bg-gradient-to-b from-[rgba(244,247,251,0.2)] to-[#F4F7FB] flex flex-col">
    <div className="flex flex-col gap-4 text-base text-center place-items-center text-slate-500 max-w-[244px] m-auto">
      <Bot size={48} />
      <p>{description}</p>
    </div>
  </Card>
);
